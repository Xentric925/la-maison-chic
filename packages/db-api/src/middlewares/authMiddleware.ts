import { Request, Response } from 'express';
import { UserRole } from '@prisma/client'; // Ensure your Prisma schema has updated UserRole enums
import jwt from 'jsonwebtoken';

import { adminPrisma, readPrisma } from '../prisma';
import { handle500Response } from '../helpers';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: () => void,
) => {
  const session = req.cookies.session;
  if (!session) {
    console.log('Session not found');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!process.env.JWT_SECRET) {
    return handle500Response(
      res,
      undefined,
      `Internal Server Error - Missing Environment Variable`,
      'userAuthController.validateLoginToken',
    );
  }

  try {
    const decoded = jwt.verify(session, process.env.JWT_SECRET);
    const { sessionId } = decoded as { sessionId: string };

    const userAuth = await adminPrisma.userAuth.findFirst({
      where: { sessionId },
      select: {
        userId: true,
      },
    });

    if (!userAuth) {
      console.log('UserAuth not found');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await readPrisma.user.findUnique({
      where: { id: userAuth.userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        details: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        role: true, // Ensure this matches your schema
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.body.user = user;
    next();
  } catch (error) {
    return handle500Response(
      res,
      error,
      `Internal Server Error`,
      'authMiddleware',
    );
  }
};

export const authRolesMiddleware = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: () => void) => {
    console.log('Roles allowed: ' + roles);
    if (!roles.includes(req.body.user.role)) {
      console.log('Role ' + req.body.user.role + ' not allowed');
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

export const authUserIdMiddleware = (
  req: Request,
  res: Response,
  next: () => void,
) => {
  const userIdFromParams = req.params.userId;
  const userIdFromBody = req.body.user.id;
  if (
    req.body.user.role !== UserRole.ADMIN &&
    userIdFromParams !== userIdFromBody
  ) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
};

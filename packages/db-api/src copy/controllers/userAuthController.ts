import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { addMinutes } from 'date-fns';
import { JobStatus, JobType } from '@prisma/client';
import { writePrisma, jobsPrisma, readPrisma, adminPrisma } from '../prisma';
import { handle500Response } from '../helpers';
import jwt from 'jsonwebtoken';
import redis from '../redis';

export const generateToken = async (userId: number) => {
  const loginToken = uuidv4();

  // Set expiration time to 5 minutes
  const expiresAt = addMinutes(new Date(), 5);

  // Store the token in the UserAuth table
  await writePrisma.userAuth.upsert({
    where: { userId },
    update: {
      loginToken,
      expiresAt,
    },
    create: {
      userId,
      loginToken,
      expiresAt,
    },
  });

  return loginToken;
};

export const loginWithEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await writePrisma.user.findUnique({
      where: { email, deletedAt: null },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cacheKey = `login:${email}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(429).json({
        message: 'Too many requests. Please try again in 2 minutes',
      });
    }

    await redis.set(cacheKey, 1, 'EX', 120); // 2 minutes

    const loginToken = await generateToken(user.id);
    await jobsPrisma.job.create({
      data: {
        type: JobType.EMAIL,
        priority: 500,
        status: JobStatus.PENDING,
        payload: {
          toEmail: email,
          token: loginToken,
        },
      },
    });

    return res
      .status(200)
      .json({ message: 'Your request has been processed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const validateLoginToken = async (req: Request, res: Response) => {
  const { loginToken } = req.body;

  if (!process.env.JWT_SECRET) {
    return handle500Response(
      res,
      undefined,
      `Internal Server Error - Missing Environment Variable`,
      'userAuthController.validateLoginToken',
    );
  }

  if (!loginToken || loginToken.length < 10) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  try {
    const userAuth = await readPrisma.userAuth.findFirst({
      where: { loginToken },
      include: {
        user: true,
      },
    });

    if (!userAuth || userAuth.loginToken !== loginToken) {
      return res.status(401).json({ message: 'Invalid Token' });
    }

    if (userAuth.expiresAt && userAuth.expiresAt < new Date()) {
      await writePrisma.userAuth.update({
        where: { id: userAuth.id },
        data: {
          loginToken: null,
        },
      });
      return res.status(401).json({ message: 'Token has expired' });
    }

    const sessionId = uuidv4();
    const refreshToken = uuidv4();
    const session = {
      sessionId,
      refreshToken,
      role: userAuth.user.role,
    };

    await writePrisma.userAuth.update({
      where: { userId: userAuth.userId },
      data: {
        loginToken: null,
        refreshToken,
        sessionId,
      },
    });

    const jwtSignedSession = jwt.sign(session, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.cookie('session', jwtSignedSession, {
      httpOnly: true, // cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV !== 'development', // cookie sent only over HTTPS
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    await adminPrisma.userHistory.create({
      data: {
        userId: userAuth.userId,
        action: 'LOGIN',
        updateDescription: `User ${userAuth.userId} logged in Successfully`,
      },
    });

    return res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await writePrisma.userAuth.update({
      where: { userId: req.body.user.id },
      data: {
        loginToken: null,
        refreshToken: null,
        sessionId: null,
      },
    });

    res.cookie('session', '', {
      httpOnly: true, // cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV !== 'development', // Ensure it's only sent over HTTPS
      sameSite: 'strict', // Strict CSRF prevention
      maxAge: 0, // Cookie expiration time (1 day)
    });

    await adminPrisma.userHistory.create({
      data: {
        userId: req.body.user.id,
        action: 'LOGOUT',
        updateDescription: `User ${req.body.user.firstName} ${req.body.user.lastName} logged out`,
      },
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return handle500Response(
      res,
      error,
      `Internal Server Error`,
      'userAuthController.logout',
    );
  }
};

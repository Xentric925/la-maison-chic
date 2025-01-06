import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { adminPrisma, jobsPrisma, readPrisma, writePrisma } from '../prisma';
import { addMinutes } from 'date-fns';
import { handle500Response } from '../helpers';
import { JobStatus, JobType } from '@prisma/client';
import redis from '../redis';

export const generateToken = async (userId: string) => {
  const loginToken = uuidv4();

  // Set expiration time to 5 minutes
  const expiresAt = addMinutes(new Date(), 5);

  // Store the token in the UserAuth table
  await adminPrisma.userAuth.upsert({
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

export const signUp = async (req: Request, res: Response) => {
  const { email, password, username, firstName, lastName } = req.body;

  if (!email || !password || !username || !firstName || !lastName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await writePrisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        role: 'USER',
        details: {
          create: { firstName, lastName },
        },
      },
    });

    return res
      .status(201)
      .json({ message: 'User created successfully', newUser });
  } catch (error) {
    return handle500Response(
      res,
      error,
      'Failed to sign up',
      'userAuthController.signUp',
    );
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  try {
    const user = await readPrisma.user.findUnique({
      where: { email },
      include: { details: true },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
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
    return handle500Response(
      res,
      error,
      'Failed to log in',
      'userAuthController.login',
    );
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
    const userAuth = await adminPrisma.userAuth.findFirst({
      where: { loginToken },
      include: {
        user: true,
      },
    });

    if (!userAuth || userAuth.loginToken !== loginToken) {
      return res.status(401).json({ message: 'Invalid Token' });
    }

    if (userAuth.expiresAt && userAuth.expiresAt < new Date()) {
      await adminPrisma.userAuth.update({
        where: { id: userAuth.id },
        data: {
          loginToken: null,
        },
      });
      return res.status(401).json({ message: 'Token has expired' });
    }

    const sessionId = uuidv4();
    const refreshId = uuidv4();
    const session = {
      sessionId,
      role: userAuth.user.role,
    };

    await adminPrisma.userAuth.update({
      where: { userId: userAuth.userId },
      data: {
        loginToken: null,
        refreshToken: refreshId,
        sessionId,
      },
    });

    const jwtSignedSession = jwt.sign(session, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign(
      { id: userAuth.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );

    res.cookie('session', jwtSignedSession, {
      httpOnly: true, // cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV !== 'development', // cookie sent only over HTTPS
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 1 hour
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    return handle500Response(
      res,
      error,
      'Failed to validate login token',
      'userAuthController.validateLoginToken',
    );
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  console.log(refreshToken);
  if (!refreshToken) {
    return res.status(400).json({ message: 'Missing refresh token' });
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
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET as string,
    ) as { refreshId: string };
    const { refreshId } = decoded;
    const userAuth = await adminPrisma.userAuth.findFirst({
      where: { refreshToken: refreshId },
      include: {
        user: true,
      },
    });

    if (!userAuth) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const sessionId = uuidv4();
    await adminPrisma.userAuth.update({
      where: { userId: userAuth.userId },
      data: {
        sessionId,
      },
    });
    const session = {
      sessionId,
      role: userAuth.user.role,
    };
    const jwtSignedSession = jwt.sign(session, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
    res.cookie('session', jwtSignedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    return res.status(200).json({ message: 'Token refreshed' });
  } catch (error) {
    console.error(error);
    return res
      .status(403)
      .json({ message: 'Invalid or expired refresh token' });
  }
};
export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Missing refresh token' });
  }

  try {
    await adminPrisma.userAuth.deleteMany({
      where: { refreshToken },
    });

    res.clearCookie('session');
    res.clearCookie('refreshToken');

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return handle500Response(
      res,
      error,
      'Failed to log out',
      'userAuthController.logout',
    );
  }
};

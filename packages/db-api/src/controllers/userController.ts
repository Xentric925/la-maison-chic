import { Request, Response } from 'express';
import { readPrisma, writePrisma } from '../prisma';

// Helper function for minimal select
const minimalUserSelect = {
  id: true,
  username: true,
  email: true,
  role: true,
  details: {
    select: {
      firstName: true,
      lastName: true,
      address: true,
      phone: true,
    },
  },
};

// Get all users (admin only)
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await readPrisma.user.findMany({
      where: { deletedAt: null },
      select: minimalUserSelect,
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch users', error });
  }
};

// Get a single user by ID (admin only)
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await readPrisma.user.findUnique({
      where: { id },
      select: minimalUserSelect,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch user', error });
  }
};

// Create a new user (admin only)
export const createUser = async (req: Request, res: Response) => {
  const {
    email,
    username,
    password,
    role,
    firstName,
    lastName,
    address,
    phone,
  } = req.body;

  if (!email || !username || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newUser = await writePrisma.user.create({
      data: {
        email,
        username,
        password,
        role: role || 'USER', // Default to USER if no role is provided
        details: {
          create: { firstName, lastName, address, phone },
        },
      },
    });

    return res
      .status(201)
      .json({ message: 'User created successfully', newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create user', error });
  }
};

// Soft delete a user (admin only)
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await writePrisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return res.status(200).json({ message: 'User deleted successfully', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete user', error });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  const { id } = req.body.user;

  try {
    const user = await readPrisma.user.findUnique({
      where: { id },
      select: minimalUserSelect,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Failed to fetch current user', error });
  }
};

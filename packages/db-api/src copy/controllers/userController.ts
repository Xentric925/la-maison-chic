import { Request, Response } from 'express';
import { adminPrisma, readPrisma, writePrisma } from '../prisma';
import { COMPANY_ID } from '../constants';
import {
  clearCache,
  fetchHierarchyRecursively,
  handle500Response,
} from '../helpers';
import redis from '../redis';
import { UserActionType } from '@prisma/client';

const minimalSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
};
const CACHE_EXPIRATION_TIME = 600; // 10 minutes

export const getAllUsers = async (
  req: Request,
  res: Response,
  count: boolean = false,
) => {
  const page = parseInt(req.query.page as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const search = req.query.search ? req.query.search.toString().trim() : null;
  const departmentId = req.query.department
    ? parseInt(req.query.department as string, 10)
    : null;
  const teamId = req.query.team ? parseInt(req.query.team as string, 10) : null;
  const groupId = req.query.group
    ? parseInt(req.query.group as string, 10)
    : null;
  const locationId = req.query.location
    ? parseInt(req.query.location as string, 10)
    : null;

  const take = count ? Number.MAX_SAFE_INTEGER : limit + 1;
  const select = count ? { id: true } : minimalSelect;

  try {
    const users = await readPrisma.user.findMany({
      where: {
        deletedAt: null,
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
        location: {
          companyId: COMPANY_ID,
          deletedAt: null,
        },
        ...(departmentId && {
          userDepartments: {
            some: {
              departmentId: departmentId,
            },
          },
        }),
        ...(teamId && {
          userTeams: {
            some: {
              teamId: teamId,
            },
          },
        }),
        ...(groupId && {
          userGroups: {
            some: {
              groupId: groupId,
            },
          },
        }),
        ...(locationId && { locationId: locationId }),
      },
      skip: page * limit,
      take,
      select: {
        ...select,
        profile: {
          select: {
            title: true,
            profileImage: true,
          },
        },
      },
    });

    if (count) {
      return res.json({ count: users.length });
    }
    const next = users.length > limit;
    if (next) {
      users.pop();
    }
    res.json({ data: users, next });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error fetching Users, page: ${page}, limit: ${limit}, search: ${search}`,
      'userController.getAllUsers',
    );
  }
};

export const getAllUsersCount = async (req: Request, res: Response) => {
  return getAllUsers(req, res, true);
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = !id ? parseInt(req.body.user.id, 10) : parseInt(id, 10);
  if (isNaN(idInt) || idInt < 1) {
    res.status(400).json({ message: `Invalid user id: ${id}` });
    return;
  }

  try {
    const user = await readPrisma.user.findUnique({
      where: {
        id: idInt,
        location: {
          companyId: COMPANY_ID,
        },
        deletedAt: null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        profile: {
          select: {
            title: true,
            profileImage: true,
            additionalInfo: true,
          },
        },
      },
    });
    const privateProfile = await adminPrisma.privateProfile.findUnique({
      where: {
        userId: idInt,
      },
      select: {
        phoneNumber: true,
        address: true,
        salary: true,
        emergencyContactNumber: true,
      },
    });
    const userWithPrivateProfile = {
      ...user,
      privateProfile,
    };
    if (!user) {
      return res.status(404).json({ message: `User ${id} not found` });
    }
    res.json(userWithPrivateProfile);
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error fetching User, id: ${id}`,
      'userController.getUserById',
    );
  }
};
export const getUserTeams = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userIdInt = parseInt(id, 10);

  if (isNaN(userIdInt) || userIdInt < 1) {
    res.status(400).json({ message: `Invalid user id: ${id}` });
    return;
  }

  const page = parseInt(req.query.page as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  try {
    const teams = await readPrisma.userTeam.findMany({
      where: {
        userId: userIdInt,
        active: true,
      },
      select: {
        team: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      skip: page * limit,
      take: limit + 1,
    });

    const next = teams.length > limit;
    if (next) {
      teams.pop();
    }

    res.json({ data: teams.map((entry) => entry.team), next });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error fetching teams for user: ${userIdInt}`,
      'userController.getUserTeams',
    );
  }
};

// The Org-Hierarchy endpoint
export const getOrgHierarchy = async (_req: Request, res: Response) => {
  const cacheKey = 'org-hierarchy'; // The cache key will be the same for all users' hierarchy

  try {
    const cachedOrgData = await redis.get(cacheKey); // Check Redis cache for the org hierarchy

    if (cachedOrgData) {
      // If data exists in cache, return it
      return res.status(200).json(JSON.parse(cachedOrgData));
    }

    // If not found in cache, fetch all top-level users (no reportsToId) and recursively build the org hierarchy
    const users = await readPrisma.user.findMany({
      where: { deletedAt: null, reportsToId: null }, // Only fetch top-level managers
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        profile: {
          select: {
            profileImage: true,
            title: true,
          },
        },
      },
    });

    if (!users) {
      return res.status(404).json({ message: 'No users found' });
    }

    // For each top-level user, fetch their full hierarchy recursively
    const orgHierarchy = await Promise.all(
      users.map(async (user) => {
        return fetchHierarchyRecursively(user.id);
      }),
    );

    // Cache the result in Redis for the next request
    await redis.set(
      cacheKey,
      JSON.stringify(orgHierarchy),
      'EX',
      CACHE_EXPIRATION_TIME,
    );

    // Return the generated organization hierarchy
    return res.status(200).json(orgHierarchy);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// User Creation (clear cache after creation)
export const createUser = async (req: Request, res: Response) => {
  const {
    email,
    firstName,
    lastName,
    role,
    locationId,
    reportsToId,
    workSettingId,
  } = req.body;

  try {
    const newUser = await writePrisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        role,
        locationId,
        reportsToId,
        workSettingId,
      },
      select: {
        id: true,
      },
    });

    // Clear the org hierarchy cache after creating a user
    await clearCache();

    res
      .status(201)
      .json({ message: `User ${newUser.id} created successfully` });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error creating user',
      'userController.createUser',
    );
  }
};

// User Update (clear cache if reportsToId changes)
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    email,
    firstName,
    lastName,
    role,
    locationId,
    reportsToId,
    workSettingId,
  } = req.body;

  const userId = parseInt(id, 10);
  if (isNaN(userId) || userId < 1) {
    return res.status(400).json({ message: `Invalid user ID: ${id}` });
  }

  try {
    const updatedUser = await writePrisma.user.update({
      where: { id: userId },
      data: {
        email,
        firstName,
        lastName,
        role,
        locationId,
        reportsToId,
        workSettingId,
      },
      select: {
        id: true,
        reportsToId: true,
      },
    });

    // If the reportsToId has changed, clear the cache
    if (updatedUser.reportsToId) {
      await clearCache();
    }

    res.status(200).json(`User ${updatedUser.id} updated successfully`);
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error updating user ID: ${id}`,
      'userController.updateUser',
    );
  }
};

// Soft Delete (clear cache after deletion)
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const userId = parseInt(id, 10);
  if (isNaN(userId) || userId < 1) {
    return res.status(400).json({ message: `Invalid user ID: ${id}` });
  }

  try {
    const deletedUser = await writePrisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
      select: {
        id: true,
      },
    });

    // Clear the org hierarchy cache after user deletion
    await clearCache();

    res.status(200).json(`User ${deletedUser.id} deleted successfully`);
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error soft deleting user ID: ${id}`,
      'userController.softDeleteUser',
    );
  }
};

export const updateUserDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, salary, actionType } = req.body;

  const userId = parseInt(id, 10);
  if (isNaN(userId) || userId < 1) {
    return res.status(400).json({ message: `Invalid user ID: ${id}` });
  }

  try {
    if (title !== undefined) {
      await writePrisma.profile.update({
        where: { userId },
        data: { title },
      });
    }

    if (salary !== undefined) {
      await adminPrisma.privateProfile.update({
        where: { userId },
        data: { salary: parseFloat(salary) },
      });
    }

    if (actionType) {
      //console.log(actionType);
      // Create userHistory entry
      const actionTypeMap: { [key: string]: UserActionType } = {
        Cut: UserActionType.CUT,
        Promotion: UserActionType.PROMOTION,
        Demotion: UserActionType.DEMOTION,
        Raise: UserActionType.RAISE,
      };

      await adminPrisma.userHistory.create({
        data: {
          userId,
          updateDescription: `User ${userId} got a ${actionType.toLowerCase()}`,
          action: actionTypeMap[actionType] || UserActionType.UNSPECIFIED,
          currentData: {
            title,
            salary: parseFloat(salary),
          },
        },
      });
    }

    res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error updating details for user ID: ${id}`,
      'userController.updateUserDetails',
    );
  }
};

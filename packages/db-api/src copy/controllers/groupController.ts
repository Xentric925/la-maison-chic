import { Request, Response } from 'express';
import { readPrisma, writePrisma } from '../prisma';
import { COMPANY_ID } from '../constants';
import { handle500Response } from '../helpers';

const minimalSelect = {
  id: true,
  name: true,
  description: true,
};

export const getAllGroups = async (
  req: Request,
  res: Response,
  count: boolean = false,
) => {
  const page = parseInt(req.query.page as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const take = count ? Number.MAX_SAFE_INTEGER : limit + 1;
  const select = count ? { id: true } : minimalSelect;

  try {
    const groups = await readPrisma.group.findMany({
      where: {
        companyId: COMPANY_ID,
        deletedAt: null,
      },
      select,
      skip: page * limit,
      take,
    });
    if (count) {
      return res.json({ count: groups.length });
    }
    const next = groups.length > limit;
    if (next) {
      groups.pop();
    }
    res.json({ data: groups, next });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching groups',
      'groupController.getAllGroups',
    );
  }
};

export const getAllGroupsCount = async (req: Request, res: Response) => {
  return getAllGroups(req, res, true);
};

export const getGroupById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);
  if (isNaN(idInt) || idInt < 1) {
    res.status(400).json({ message: `Invalid group id: ${id}` });
    return;
  }

  try {
    const group = await readPrisma.group.findUnique({
      where: {
        id: idInt,
        companyId: COMPANY_ID,
        deletedAt: null,
      },
      select: {
        ...minimalSelect,
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        groupUsers: {
          select: {
            userId: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                profile: {
                  select: {
                    title: true,
                    profileImage: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!group) {
      return res.status(404).json({ message: `Group ${id} not found` });
    }
    res.json(group);
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error fetching Group, id: '${id}'`,
      'groupController.getGroupById',
    );
  }
};

export const createGroup = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  try {
    const newGroup = await writePrisma.group.create({
      data: {
        name,
        description,
        companyId: COMPANY_ID,
      },
      select: {
        id: true,
      },
    });
    res
      .status(201)
      .json({ message: `Group ${newGroup.id} created successfully` });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error creating Group`,
      'groupController.createGroup',
      JSON.stringify(req.body),
    );
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);
  if (isNaN(idInt) || idInt < 1) {
    res.status(400).json({ message: `Invalid group id: ${id}` });
    return;
  }
  const { name, description } = req.body;

  try {
    await writePrisma.group.update({
      where: { id: idInt, companyId: COMPANY_ID },
      data: {
        name,
        description,
      },
      select: {
        id: true,
      },
    });
    res.status(200).json({ message: `Group ${id} updated successfully` });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error updating Group: ${id}`,
      'groupController.updateGroup',
      JSON.stringify(req.body),
    );
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);
  if (isNaN(idInt) || idInt < 1) {
    res.status(400).json({ message: `Invalid group id: ${id}` });
    return;
  }
  try {
    await writePrisma.group.update({
      where: { id: idInt, companyId: COMPANY_ID },
      data: { deletedAt: new Date() },
      select: {
        id: true,
      },
    });
    res.status(200).json({ message: `Group ${id} deleted successfully` });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error deleting Group '${id}'`,
      'groupController.deleteGroup',
    );
  }
};

export const addGroupMember = async (req: Request, res: Response) => {
  const { id } = req.params; // Group ID
  const { memberId } = req.body; // User ID to be added
  const idInt = parseInt(id, 10);
  const memberIdInt = parseInt(memberId, 10);

  if (isNaN(idInt) || idInt < 1 || isNaN(memberIdInt) || memberIdInt < 1) {
    return res.status(400).json({ message: 'Invalid group or member ID' });
  }

  try {
    // Check if the user is already part of the group
    const existingMembership = await writePrisma.userGroup.findUnique({
      where: { userId_groupId: { userId: memberIdInt, groupId: idInt } },
    });

    if (existingMembership) {
      // If the user is already in the group but inactive, reactivate them
      if (!existingMembership.active) {
        await writePrisma.userGroup.update({
          where: { userId_groupId: { userId: memberIdInt, groupId: idInt } },
          data: { active: true },
        });
        return res.status(200).json({
          message: `User ${memberIdInt} reactivated in Group ${idInt}`,
        });
      }

      // If the user is already active, return a message
      return res.status(200).json({
        message: `User ${memberIdInt} is already active in Group ${idInt}`,
      });
    }

    // If the user is not part of the group, create a new record
    await writePrisma.userGroup.create({
      data: {
        userId: memberIdInt,
        groupId: idInt,
        active: true,
      },
    });

    return res
      .status(201)
      .json({ message: `User ${memberIdInt} added to Group ${idInt}` });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error adding member to Group: ${idInt}`,
      'groupController.addGroupMember',
    );
  }
};

export const removeGroupMember = async (req: Request, res: Response) => {
  const { id, memberId } = req.params;
  const idInt = parseInt(id, 10);
  const memberIdInt = parseInt(memberId, 10);

  if (isNaN(idInt) || idInt < 1 || isNaN(memberIdInt) || memberIdInt < 1) {
    res.status(400).json({ message: `Invalid group or member id` });
    return;
  }

  try {
    await writePrisma.userGroup.update({
      where: { userId_groupId: { userId: memberIdInt, groupId: idInt } },
      data: {
        active: false,
      },
    });
    res
      .status(200)
      .json({ message: `Member ${memberIdInt} removed from Group ${idInt}` });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error removing member from Group: ${idInt}`,
      'groupController.removeGroupMember',
    );
  }
};

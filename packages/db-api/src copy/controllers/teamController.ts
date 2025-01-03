import { Request, Response } from 'express';
import { readPrisma, writePrisma } from '../prisma';
import { COMPANY_ID } from '../constants';
import { handle500Response } from '../helpers';

const minimalSelect = {
  id: true,
  name: true,
  description: true,
};

export const getAllTeams = async (
  req: Request,
  res: Response,
  count: boolean = false,
) => {
  const page = parseInt(req.query.page as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const take = count ? Number.MAX_SAFE_INTEGER : limit + 1;
  const select = count ? { id: true } : minimalSelect;

  try {
    const teams = await readPrisma.team.findMany({
      where: {
        companyId: COMPANY_ID,
        deletedAt: null,
      },
      select,
      skip: page * limit,
      take,
    });
    if (count) {
      return res.json({ count: teams.length });
    }
    const next = teams.length > limit;
    if (next) {
      teams.pop();
    }
    res.json({ data: teams, next });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching teams',
      'teamController.getAllTeams',
    );
  }
};

export const getAllTeamsCount = async (req: Request, res: Response) => {
  return getAllTeams(req, res, true);
};

export const getTeamById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);
  if (isNaN(idInt) || idInt < 1) {
    res.status(400).json({ message: `Invalid team id: ${id}` });
    return;
  }

  try {
    const team = await readPrisma.team.findUnique({
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
        teamUsers: {
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
          where: {
            active: true,
          },
        },
      },
    });

    if (!team) {
      return res.status(404).json({ message: `Team ${id} not found` });
    }
    res.json(team);
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error fetching Team, id: '${id}'`,
      'teamController.getTeamById',
    );
  }
};

export const createTeam = async (req: Request, res: Response) => {
  const { name, description, locationId } = req.body;

  try {
    const newTeam = await writePrisma.team.create({
      data: {
        name,
        description,
        locationId: locationId || null,
        companyId: COMPANY_ID,
      },
      select: {
        id: true,
      },
    });
    res
      .status(201)
      .json({ message: `Team ${newTeam.id} created successfully` });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error creating Team`,
      'teamController.createTeam',
      JSON.stringify(req.body),
    );
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);
  if (isNaN(idInt) || idInt < 1) {
    res.status(400).json({ message: `Invalid team id: ${id}` });
    return;
  }
  const { name, description } = req.body;

  try {
    await writePrisma.team.update({
      where: { id: idInt, companyId: COMPANY_ID },
      data: {
        name,
        description,
      },
      select: {
        id: true,
      },
    });
    res.status(200).json({ message: `Team ${id} updated successfully` });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error updating Team: ${id}`,
      'teamController.updateTeam',
      JSON.stringify(req.body),
    );
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);
  if (isNaN(idInt) || idInt < 1) {
    res.status(400).json({ message: `Invalid team id: ${id}` });
    return;
  }
  try {
    await writePrisma.team.update({
      where: { id: idInt, companyId: COMPANY_ID },
      data: { deletedAt: new Date() },
      select: {
        id: true,
      },
    });
    res.status(200).json({ message: `Team ${id} deleted successfully` });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error deleting Team '${id}'`,
      'teamController.deleteTeam',
    );
  }
};

export const addTeamMember = async (req: Request, res: Response) => {
  const { id } = req.params; // Team ID
  const { memberId } = req.body; // User ID to be added
  const idInt = parseInt(id, 10);
  const memberIdInt = parseInt(memberId, 10);

  if (isNaN(idInt) || idInt < 1 || isNaN(memberIdInt) || memberIdInt < 1) {
    return res.status(400).json({ message: 'Invalid team or member ID' });
  }

  try {
    // Check if the user is already part of the team
    const existingMembership = await writePrisma.userTeam.findUnique({
      where: { userId_teamId: { userId: memberIdInt, teamId: idInt } },
    });

    if (existingMembership) {
      // If the user is already in the team but inactive, reactivate them
      if (!existingMembership.active) {
        await writePrisma.userTeam.update({
          where: { userId_teamId: { userId: memberIdInt, teamId: idInt } },
          data: { active: true },
        });
        return res.status(200).json({
          message: `User ${memberIdInt} reactivated in Team ${idInt}`,
        });
      }

      // If the user is already active, return a message
      return res.status(200).json({
        message: `User ${memberIdInt} is already active in Team ${idInt}`,
      });
    }

    // If the user is not part of the team, create a new record
    await writePrisma.userTeam.create({
      data: {
        userId: memberIdInt,
        teamId: idInt,
        active: true,
      },
    });

    return res
      .status(201)
      .json({ message: `User ${memberIdInt} added to Team ${idInt}` });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error adding member to Team: ${idInt}`,
      'teamController.addTeamMember',
    );
  }
};

export const removeTeamMember = async (req: Request, res: Response) => {
  const { id, memberId } = req.params;
  const idInt = parseInt(id, 10);
  const memberIdInt = parseInt(memberId, 10);

  if (isNaN(idInt) || idInt < 1 || isNaN(memberIdInt) || memberIdInt < 1) {
    res.status(400).json({ message: `Invalid team or member id` });
    return;
  }

  try {
    await writePrisma.userTeam.update({
      where: { userId_teamId: { userId: memberIdInt, teamId: idInt } },
      data: {
        active: false,
      },
    });
    res
      .status(200)
      .json({ message: `Member ${memberIdInt} removed from Team ${idInt}` });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error removing member from Team: ${idInt}`,
      'teamController.removeTeamMember',
    );
  }
};

import { Prisma, UserActionType, PrismaClient } from '@prisma/client';
import { writePrisma } from '../prisma';

// Helper function to log user actions in UserHistory
async function logUserAction(
  userId: number,
  action: UserActionType,
  description: string,
  previousData: Prisma.InputJsonValue,
  currentData: Prisma.InputJsonValue,
) {
  await writePrisma.userHistory.create({
    data: {
      userId,
      action,
      updateDescription: description,
      previousData: previousData,
      currentData: currentData,
    },
  });
}

export function applyPrismaExtensions(prisma: PrismaClient) {
  return prisma.$extends({
    query: {
      // Handle UserTeam Changes
      userTeam: {
        // When a User is added to a Team
        async create({ args, query }) {
          const result = await query(args);

          const { userId, teamId } = args.data;
          const team = await prisma.team.findUnique({ where: { id: teamId } });
          const user = await prisma.user.findUnique({ where: { id: userId } });
          const userTeams = await prisma.userTeam.findMany({
            where: {
              userId,
            },
            select: {
              team: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          });
          // Log addition of a member to a team
          await logUserAction(
            userId!,
            UserActionType.TEAM_MEMBER_ADDED,
            `Employee ${user?.firstName} ${user?.lastName} added to team ${team?.name}`,
            {
              user: {
                id: user?.id,
                firstName: user?.firstName,
                lastName: user?.lastName,
                teams: [...userTeams],
              },
            },
            {
              user: {
                id: user?.id,
                firstName: user?.firstName,
                lastName: user?.lastName,
                teams: [...userTeams, { id: teamId, name: team!.name }],
              },
            },
          );

          return result;
        },
        // When a User is removed from a Team ie the relationship is soft deleted
        async update({ args, query }) {
          const result = await query(args);

          const { userId, teamId, active } = args.data;
          if (active) {
            const team = await prisma.team.findUnique({
              where: { id: teamId as number },
            });
            const user = await prisma.user.findUnique({
              where: { id: userId as number },
            });
            const userTeams = await prisma.userTeam.findMany({
              where: {
                userId: userId as number,
              },
              select: {
                team: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            });
            // Log removal of a member from a team
            await logUserAction(
              userId as number,
              UserActionType.TEAM_MEMBER_REMOVED,
              `Employee ${user?.firstName} ${user?.lastName} removed from team ${team?.name}`,
              {
                user: {
                  id: user?.id,
                  firstName: user?.firstName,
                  lastName: user?.lastName,
                  teams: [...userTeams],
                },
              },
              {
                user: {
                  id: user?.id,
                  firstName: user?.firstName,
                  lastName: user?.lastName,
                  teams: userTeams.filter((e) => e.team.id != teamId),
                },
              },
            );
          }

          return result;
        },
      },
      // Handle UserGroup Changes
      userGroup: {
        // When a User is added to a Group
        async create({ args, query }) {
          const result = await query(args);

          const { userId, groupId } = args.data;
          const group = await prisma.group.findUnique({
            where: { id: groupId },
          });
          const user = await prisma.user.findUnique({ where: { id: userId } });
          const userGroups = await prisma.userGroup.findMany({
            where: {
              userId,
            },
            select: {
              group: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          });

          // Log addition of a member to a group
          await logUserAction(
            userId!,
            UserActionType.GROUP_MEMBER_ADDED,
            `Employee ${user?.firstName} ${user?.lastName} added to group ${group?.name}`,
            {
              user: {
                id: user?.id,
                firstName: user?.firstName,
                lastName: user?.lastName,
                groups: [...userGroups],
              },
            },
            {
              user: {
                id: user?.id,
                firstName: user?.firstName,
                lastName: user?.lastName,
                groups: [...userGroups, { id: groupId, name: group!.name }],
              },
            },
          );
          return result;
        },
        // When a User is removed from a Group ie the relationship is soft deleted
        async update({ args, query }) {
          const result = await query(args);

          const { userId, groupId, active } = args.data;
          if (active) {
            const group = await prisma.group.findUnique({
              where: { id: groupId as number },
            });
            const user = await prisma.user.findUnique({
              where: { id: userId as number },
            });
            const userGroups = await prisma.userGroup.findMany({
              where: {
                userId: userId as number,
              },
              select: {
                group: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            });
            // Log removal of a member from a group
            await logUserAction(
              userId as number,
              UserActionType.GROUP_MEMBER_REMOVED,
              `Employee ${user?.firstName} ${user?.lastName} removed from group ${group?.name}`,
              {
                user: {
                  id: user?.id,
                  firstName: user?.firstName,
                  lastName: user?.lastName,
                  groups: [...userGroups],
                },
              },
              {
                user: {
                  id: user?.id,
                  firstName: user?.firstName,
                  lastName: user?.lastName,
                  groups: userGroups.filter((e) => e.group.id != groupId),
                },
              },
            );
          }

          return result;
        },
      },
    },
  });
}

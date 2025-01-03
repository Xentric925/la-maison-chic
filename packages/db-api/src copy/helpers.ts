import { Response } from 'express';
import redis from './redis';
import { readPrisma } from './prisma';

export const handle500Response = (
  res: Response,
  error: unknown,
  message: string,
  source: string,
  reqBodyJson?: string,
) => {
  const errorMessage =
    error instanceof Error && error?.message ? error.message : message;
  // TODO: log to a service
  console.log(
    `Error in ${source}: ${errorMessage} - Request Body: ${reqBodyJson}`,
  );
  res.status(500).json({ message: errorMessage });
};

// Clear org hierarchy cache
export const clearCache = async () => {
  const cacheKey = 'org-hierarchy';
  await redis.del(cacheKey); // Delete the cached org hierarchy data
};

const hierarchicalSelect = {
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
  directReports: {
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
  },
};
interface UserHierarchy {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  directReports: UserHierarchy[];
}
// Recursive function to fetch direct reports and build hierarchy
export const fetchHierarchyRecursively = async (
  userId: number,
): Promise<UserHierarchy | null> => {
  // Fetch the user with direct reports
  const user = await readPrisma.user.findUnique({
    where: { id: userId },
    select: { ...hierarchicalSelect },
  });

  if (!user) return null;

  // Recursively fetch the direct reports
  const directReports = await Promise.all(
    user.directReports.map(async (report) => {
      const reportHierarchy = await fetchHierarchyRecursively(report.id);
      return {
        ...report,
        directReports: reportHierarchy ? reportHierarchy.directReports : [],
      };
    }),
  );

  return {
    ...user,
    directReports: directReports,
  };
};

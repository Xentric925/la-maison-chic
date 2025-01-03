import { Request, Response } from 'express';
import { adminPrisma } from '../prisma';
import { handle500Response } from '../helpers';
import { subMonths } from 'date-fns';

// General logs (Admin-specific)
export const getGeneralLogs = async (_req: Request, res: Response) => {
  try {
    const logs = await adminPrisma.log.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(logs);
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error fetching general logs',
      'getGeneralLogs',
    );
  }
};

// User-related logs (User History)
export const getUserHistory = async (req: Request, res: Response) => {
  const { userId, startDate, endDate, action } = req.query;

  try {
    // Default to 3 months if startDate or endDate is not provided
    const defaultStartDate = subMonths(new Date(), 3);
    const start = startDate ? new Date(startDate as string) : defaultStartDate;
    const end = endDate ? new Date(endDate as string) : new Date();

    // Construct the where clause for filtering
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      createdAt: {
        gte: start,
        lte: end,
      },
    };

    // Filter by specific action type if provided
    if (action) {
      whereClause.action = action;
    }

    // If userId is provided, filter by the user
    if (userId) {
      whereClause.userId = parseInt(userId as string);
    }

    // Fetch the user history with the constructed filters
    const userHistory = await adminPrisma.userHistory.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    res.json(userHistory);
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error fetching user history',
      'getUserHistory',
    );
  }
};

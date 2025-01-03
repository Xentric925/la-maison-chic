import { Request, Response } from 'express';
import { readPrisma, writePrisma } from '../prisma';
import { handle500Response } from '../helpers';

export const getDayoffs = async (_req: Request, res: Response) => {
  try {
    const holidays = await readPrisma.dayOff.findMany();
    res.json(holidays);
  } catch (error) {
    handle500Response(res, error, 'Error fetching holidays', 'getDayoff');
  }
};

export const createDayOff = async (req: Request, res: Response) => {
  const { name, fromDate, toDate } = req.body;

  try {
    const newHoliday = await writePrisma.dayOff.create({
      data: { name, fromDate, toDate },
    });
    res.status(201).json(newHoliday);
  } catch (error) {
    handle500Response(res, error, 'Error creating holiday', 'createDayOff');
  }
};

export const updateDayOff = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, fromDate, toDate } = req.body;

  try {
    const updatedHoliday = await writePrisma.dayOff.update({
      where: { id: parseInt(id) },
      data: { name, fromDate, toDate },
    });
    res.json(updatedHoliday);
  } catch (error) {
    handle500Response(res, error, 'Error updating holiday', 'updateDayOff');
  }
};

export const deleteDayOff = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await writePrisma.dayOff.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });
    res.status(200).json({ message: `Holiday ${id} deleted.` });
  } catch (error) {
    handle500Response(res, error, 'Error deleting holiday', 'deleteDayOff');
  }
};

export const countFutureDayOffs = async (_req: Request, res: Response) => {
  try {
    const today = new Date();
    const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999); // December 31st of the current year

    const count = await readPrisma.dayOff.count({
      where: {
        fromDate: {
          gt: today, // Future day-offs
          lte: endOfYear, // Within the current year
        },
        deletedAt: null, // Ensure not deleted
      },
    });
    res.json({ count });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error counting future day-offs',
      'countFutureDayOffs',
    );
  }
};

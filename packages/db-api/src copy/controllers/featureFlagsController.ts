import { Request, Response } from 'express';
import { readPrisma, writePrisma } from '../prisma';
import { handle500Response } from '../helpers';

export const getFeatureFlags = async (_req: Request, res: Response) => {
  try {
    const flags = await readPrisma.featureFlag.findMany();
    res.json(flags);
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error fetching feature flags',
      'getFeatureFlags',
    );
  }
};

export const createFeatureFlag = async (req: Request, res: Response) => {
  const { name, description, isActive } = req.body;

  try {
    const newFlag = await writePrisma.featureFlag.create({
      data: { name, description, isActive },
    });
    res.status(201).json(newFlag);
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error creating feature flag',
      'createFeatureFlag',
    );
  }
};

export const updateFeatureFlag = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, isActive } = req.body;

  try {
    const updatedFlag = await writePrisma.featureFlag.update({
      where: { id: parseInt(id) },
      data: { name, description, isActive },
    });
    res.json(updatedFlag);
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error updating feature flag',
      'updateFeatureFlag',
    );
  }
};

export const deleteFeatureFlag = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await writePrisma.featureFlag.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });
    res.status(200).json({ message: `Feature flag ${id} deleted.` });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error deleting feature flag',
      'deleteFeatureFlag',
    );
  }
};

import { Request, Response } from 'express';
import { readPrisma, writePrisma } from '../prisma';
import { COMPANY_ID } from '../constants';
import { handle500Response } from '../helpers';

const minimalSelect = {
  id: true,
  name: true,
  country: true,
  city: true,
  address: true,
};

export const getAllLocations = async (
  req: Request,
  res: Response,
  count: boolean = false,
) => {
  const page = parseInt(req.query.page as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const take = count ? Number.MAX_SAFE_INTEGER : limit + 1;
  const select = count ? { id: true } : minimalSelect;

  try {
    const locations = await readPrisma.location.findMany({
      where: {
        companyId: COMPANY_ID,
        deletedAt: null,
      },
      select,
      skip: page * limit,
      take,
    });
    if (count) {
      return res.json({ count: locations.length });
    }
    const next = locations.length > limit;
    if (next) {
      locations.pop();
    }
    res.json({ data: locations, next });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching locations',
      'locationController.getAllLocations',
    );
  }
};

export const getAllLocationsCount = async (req: Request, res: Response) => {
  return getAllLocations(req, res, true);
};

export const getLocationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);
  if (isNaN(idInt) || idInt < 1) {
    res.status(400).json({ message: `Invalid record id: ${id}` });
    return;
  }

  try {
    const location = await readPrisma.location.findUnique({
      where: {
        companyId: COMPANY_ID,
        id: idInt,
        deletedAt: null,
      },
      select: minimalSelect,
    });

    if (!location) {
      return res.status(404).json({ message: `Location ${id} not found` });
    }
    res.json(location);
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error fetching Location, id: '${id}`,
      'locationController.getLocation',
    );
  }
};

export const createLocation = async (req: Request, res: Response) => {
  const { name, country, city, address, workSettingId } = req.body;

  try {
    const newLocation = await writePrisma.location.create({
      data: {
        name,
        country,
        city,
        address,
        companyId: COMPANY_ID,
        workSettingId,
      },
      select: {
        id: true,
      },
    });
    res
      .status(201)
      .json({ message: `Location ${newLocation.id} created successfully` });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error creating Location`,
      'locationController.createLocation',
      JSON.stringify(req.body),
    );
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);
  if (isNaN(idInt) || idInt < 1) {
    res.status(400).json({ message: `Invalid location id: ${id}` });
    return;
  }
  const { name, country, city, address, workSettingId } = req.body;

  try {
    await writePrisma.location.update({
      where: { id: idInt, companyId: COMPANY_ID },
      data: {
        name,
        country,
        city,
        address,
        workSettingId,
      },
      select: {
        id: true,
      },
    });
    res.status(200).json({ message: `Location ${id} updated successfully` });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error updating Location: ${id}`,
      'locationController.updateLocation',
      JSON.stringify(req.body),
    );
  }
};

export const deleteLocation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);
  if (isNaN(idInt) || idInt < 1) {
    res.status(400).json({ message: `Invalid record id: ${id}` });
    return;
  }
  try {
    await writePrisma.location.update({
      where: { id: idInt, companyId: COMPANY_ID },
      data: { deletedAt: new Date() },
      select: {
        id: true,
      },
    });
    res.status(200).json({ message: `Location ${id} deleted successfully` });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error deleting Location '${id}'`,
      'locationController.deleteLocation',
    );
  }
};

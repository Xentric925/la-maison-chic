import { Request, Response } from 'express';
import { readPrisma, writePrisma } from '../prisma';
import { COMPANY_ID } from '../constants';
import { handle500Response } from '../helpers';

const minimalSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
};

export const getAllDepartments = async (
  req: Request,
  res: Response,
  count: boolean = false,
) => {
  const page = parseInt(req.query.page as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const take = count ? Number.MAX_SAFE_INTEGER : limit + 1;
  const select = count ? { id: true } : minimalSelect;

  try {
    const departments = await readPrisma.department.findMany({
      where: {
        companyId: COMPANY_ID,
        deletedAt: null,
      },
      select,
      skip: page * limit,
      take,
    });
    if (count) {
      return res.json({ count: departments.length });
    }
    const next = departments.length > limit;
    if (next) {
      departments.pop();
    }
    res.json({ data: departments, next });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching departments',
      'departmentController.getAllDepartments',
    );
  }
};

export const getAllDepartmentsCount = async (req: Request, res: Response) => {
  return getAllDepartments(req, res, true);
};

export const getDepartmentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);
  if (isNaN(idInt) || idInt < 1) {
    res.status(400).json({ message: `Invalid record id: ${id}` });
    return;
  }

  try {
    const department = await readPrisma.department.findUnique({
      where: {
        companyId: COMPANY_ID,
        id: idInt,
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
      },
    });

    if (!department) {
      return res.status(404).json({ message: `Department ${id} not found` });
    }
    res.json(department);
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error fetching Department, id: '${id}'`,
      'departmentController.getDepartmentById',
    );
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  const { name, description, locationId } = req.body;

  try {
    const newDepartment = await writePrisma.department.create({
      data: {
        name,
        description,
        companyId: COMPANY_ID,
        locationId: locationId || null,
      },
      select: {
        id: true,
      },
    });
    res
      .status(201)
      .json({ message: `Department ${newDepartment.id} created successfully` });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error creating Department`,
      'departmentController.createDepartment',
      JSON.stringify(req.body),
    );
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);
  if (isNaN(idInt) || idInt < 1) {
    res.status(400).json({ message: `Invalid department id: ${id}` });
    return;
  }
  const { name, description, locationId } = req.body;

  try {
    await writePrisma.department.update({
      where: { id: idInt, companyId: COMPANY_ID },
      data: {
        name,
        description,
        locationId: locationId || null,
      },
      select: {
        id: true,
      },
    });
    res.status(200).json({ message: `Department ${id} updated successfully` });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error updating Department: ${id}`,
      'departmentController.updateDepartment',
      JSON.stringify(req.body),
    );
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);
  if (isNaN(idInt) || idInt < 1) {
    res.status(400).json({ message: `Invalid record id: ${id}` });
    return;
  }
  try {
    await writePrisma.department.update({
      where: { id: idInt, companyId: COMPANY_ID },
      data: { deletedAt: new Date() },
      select: {
        id: true,
      },
    });
    res.status(200).json({ message: `Department ${id} deleted successfully` });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error deleting Department '${id}'`,
      'departmentController.deleteDepartment',
    );
  }
};

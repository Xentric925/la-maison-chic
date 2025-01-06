import { Request, Response } from 'express';
import { readPrisma, writePrisma } from '../prisma';
import { handle500Response } from '../helpers';

// Helper function for minimal select
const minimalSupplierSelect = {
  id: true,
  details: {
    select: {
      firstName: true,
      lastName: true,
      address: true,
      phone: true,
    },
  },
  createdAt: true,
  updatedAt: true,
};

// Get all suppliers (admin only)
export const getAllSuppliers = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, address, phone, skip, take } = req.query;

    const suppliers = await readPrisma.supplier.findMany({
      where: {
        details: {
          firstName: firstName
            ? { contains: firstName as string, mode: 'insensitive' }
            : undefined,
          lastName: lastName
            ? { contains: lastName as string, mode: 'insensitive' }
            : undefined,
          address: address
            ? { contains: address as string, mode: 'insensitive' }
            : undefined,
          phone: phone ? { contains: phone as string } : undefined,
        },
        deletedAt: null,
      },
      select: minimalSupplierSelect,
      skip: skip ? parseInt(skip as string) : 0,
      take: take ? parseInt(take as string) : 10,
    });

    return res.status(200).json(suppliers);
  } catch (error) {
    console.error(error);
    return handle500Response(
      res,
      error,
      'Failed to fetch suppliers',
      'supplierController.getAllSuppliers',
    );
  }
};

// Get a supplier by ID (admin only)
export const getSupplierById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const supplier = await readPrisma.supplier.findUnique({
      where: { id },
      select: minimalSupplierSelect,
    });

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    return res.status(200).json(supplier);
  } catch (error) {
    console.error(error);
    return handle500Response(
      res,
      error,
      'Failed to fetch supplier',
      'supplierController.getSupplierById',
    );
  }
};

// Create a supplier (admin only)
export const createSupplier = async (req: Request, res: Response) => {
  const { firstName, lastName, address, phone } = req.body;

  if (!firstName || !lastName || !address || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newSupplier = await writePrisma.supplier.create({
      data: {
        details: {
          create: { firstName, lastName, address, phone },
        },
      },
    });

    return res
      .status(201)
      .json({ message: 'Supplier created successfully', newSupplier });
  } catch (error) {
    console.error(error);
    return handle500Response(
      res,
      error,
      'Failed to create supplier',
      'supplierController.createSupplier',
    );
  }
};

// Update a supplier (admin only)
export const updateSupplier = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, address, phone } = req.body;

  try {
    const updatedSupplier = await writePrisma.supplier.update({
      where: { id },
      data: {
        details: {
          update: { firstName, lastName, address, phone },
        },
      },
    });

    return res
      .status(200)
      .json({ message: 'Supplier updated successfully', updatedSupplier });
  } catch (error) {
    console.error(error);
    return handle500Response(
      res,
      error,
      'Failed to update supplier',
      'supplierController.updateSupplier',
    );
  }
};

// Soft delete a supplier (admin only)
export const deleteSupplier = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedSupplier = await writePrisma.supplier.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return res
      .status(200)
      .json({ message: 'Supplier deleted successfully', deletedSupplier });
  } catch (error) {
    console.error(error);
    return handle500Response(
      res,
      error,
      'Failed to delete supplier',
      'supplierController.deleteSupplier',
    );
  }
};

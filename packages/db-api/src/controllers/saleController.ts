import { Request, Response } from 'express';
import { readPrisma, writePrisma } from '../prisma';
import { handle500Response } from '../helpers';
import { SaleStatus } from '@prisma/client';

// Helper function for minimal select
const minimalSaleSelect = {
  id: true,
  totalCost: true,
  paidAmount: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  salesDetails: {
    select: {
      id: true,
      product: {
        select: {
          name: true,
        },
      },
      quantity: true,
      soldPrice: true,
    },
  },
};

// Get all sales (admin only)
export const getAllSales = async (req: Request, res: Response) => {
  try {
    const { status, customerId, totalCost, skip, take } = req.query;

    const sales = await readPrisma.sale.findMany({
      where: {
        status: status ? (status as SaleStatus) : undefined,
        customerId: customerId ? (customerId as string) : undefined,
        totalCost: totalCost
          ? { equals: parseFloat(totalCost as string) }
          : undefined,
        deletedAt: null,
      },
      select: minimalSaleSelect,
      skip: skip ? parseInt(skip as string) : 0,
      take: take ? parseInt(take as string) : 10,
    });

    return res.status(200).json(sales);
  } catch (error) {
    console.error(error);
    return handle500Response(
      res,
      error,
      'Failed to fetch sales',
      'saleController.getAllSales',
    );
  }
};

// Get a sale by ID (admin or owner)
export const getSaleById = async (req: Request, res: Response) => {
  const { role, id: userId } = req.body.user;
  const { id } = req.params;

  try {
    const sale = await readPrisma.sale.findUnique({
      where: { id },
      select: { ...minimalSaleSelect, customerId: true },
    });

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    if (role !== 'ADMIN' && sale.customerId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return res.status(200).json(sale);
  } catch (error) {
    console.error(error);
    return handle500Response(
      res,
      error,
      'Failed to fetch sale',
      'saleController.getSaleById',
    );
  }
};

// Create a sale (admin or user)
export const createSale = async (req: Request, res: Response) => {
  const { role, id: userId } = req.body.user;
  const { totalCost, paidAmount, status, salesDetails } = req.body;

  if (!salesDetails || salesDetails.length === 0) {
    return res.status(400).json({ message: 'Missing required sales details' });
  }

  try {
    const newSale = await writePrisma.sale.create({
      data: {
        customerId: role === 'ADMIN' ? req.body.customerId : userId,
        totalCost,
        paidAmount: paidAmount ?? 0,
        status: role === 'ADMIN' ? (status ?? 'PENDING') : 'PENDING',
        salesDetails: {
          create: salesDetails.map(
            (detail: {
              productId: string;
              quantity: number;
              soldPrice: number;
            }) => ({
              productId: detail.productId,
              quantity: detail.quantity,
              soldPrice: detail.soldPrice,
            }),
          ),
        },
      },
    });

    return res
      .status(201)
      .json({ message: 'Sale created successfully', newSale });
  } catch (error) {
    console.error(error);
    return handle500Response(
      res,
      error,
      'Failed to create sale',
      'saleController.createSale',
    );
  }
};

// Get purchase history (user-specific)
export const getPurchaseHistory = async (req: Request, res: Response) => {
  const { id: userId } = req.body.user;

  try {
    const sales = await readPrisma.sale.findMany({
      where: {
        customerId: userId,
        deletedAt: null,
      },
      select: minimalSaleSelect,
    });

    return res.status(200).json(sales);
  } catch (error) {
    console.error(error);
    return handle500Response(
      res,
      error,
      'Failed to fetch purchase history',
      'saleController.getPurchaseHistory',
    );
  }
};

// Soft delete a sale (admin only)
export const deleteSale = async (req: Request, res: Response) => {
  const { role } = req.body.user;
  const { id } = req.params;

  if (role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const deletedSale = await writePrisma.sale.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return res
      .status(200)
      .json({ message: 'Sale deleted successfully', deletedSale });
  } catch (error) {
    console.error(error);
    return handle500Response(
      res,
      error,
      'Failed to delete sale',
      'saleController.deleteSale',
    );
  }
};

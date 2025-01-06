import { Request, Response } from 'express';
import { readPrisma, writePrisma } from '../prisma';
import { handle500Response } from '../helpers';
import { PurchaseStatus } from '@prisma/client';

// Helper function for minimal select
const minimalPurchaseSelect = {
  id: true,
  totalCost: true,
  paidAmount: true,
  status: true,
  dueDate: true,
  createdAt: true,
  updatedAt: true,
  supplier: {
    select: {
      id: true,
      details: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  },
  purchaseDetails: {
    select: {
      id: true,
      product: {
        select: {
          name: true,
        },
      },
      quantity: true,
      costPrice: true,
    },
  },
};

// Get all purchases (admin only)
export const getAllPurchases = async (req: Request, res: Response) => {
  try {
    const { status, supplierId, dueDate, skip, take } = req.query;

    const purchases = await readPrisma.purchase.findMany({
      where: {
        status: status ? (status as PurchaseStatus) : undefined,
        supplierId: supplierId ? (supplierId as string) : undefined,
        dueDate: dueDate ? new Date(dueDate as string) : undefined,
        deletedAt: null,
      },
      select: minimalPurchaseSelect,
      skip: skip ? parseInt(skip as string) : 0,
      take: take ? parseInt(take as string) : 10,
    });

    return res.status(200).json(purchases);
  } catch (error) {
    console.error(error);
    return handle500Response(
      res,
      error,
      'Failed to fetch purchases',
      'purchaseController.getAllPurchases',
    );
  }
};

// Get a purchase by ID (admin only)
export const getPurchaseById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const purchase = await readPrisma.purchase.findUnique({
      where: { id },
      select: minimalPurchaseSelect,
    });

    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    return res.status(200).json(purchase);
  } catch (error) {
    console.error(error);
    return handle500Response(
      res,
      error,
      'Failed to fetch purchase',
      'purchaseController.getPurchaseById',
    );
  }
};

// Create a purchase (admin only)
export const createPurchase = async (req: Request, res: Response) => {
  const {
    supplierId,
    totalCost,
    paidAmount,
    status,
    dueDate,
    purchaseDetails,
  } = req.body;

  if (
    !supplierId ||
    !totalCost ||
    !purchaseDetails ||
    purchaseDetails.length === 0
  ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newPurchase = await writePrisma.purchase.create({
      data: {
        supplierId,
        totalCost,
        paidAmount: paidAmount ?? 0,
        status: status ?? 'PENDING',
        dueDate,
        purchaseDetails: {
          create: purchaseDetails.map(
            (detail: {
              productId: string;
              quantity: number;
              costPrice: number;
            }) => ({
              productId: detail.productId,
              quantity: detail.quantity,
              costPrice: detail.costPrice,
            }),
          ),
        },
      },
    });

    return res
      .status(201)
      .json({ message: 'Purchase created successfully', newPurchase });
  } catch (error) {
    console.error(error);
    return handle500Response(
      res,
      error,
      'Failed to create purchase',
      'purchaseController.createPurchase',
    );
  }
};

// Update a purchase (admin only)
export const updatePurchase = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { totalCost, paidAmount, status, dueDate, purchaseDetails } = req.body;

  try {
    const updatedPurchase = await writePrisma.purchase.update({
      where: { id },
      data: {
        totalCost,
        paidAmount,
        status,
        dueDate,
        purchaseDetails: purchaseDetails
          ? {
              deleteMany: {}, // Remove existing purchase details
              create: purchaseDetails.map(
                (detail: {
                  productId: string;
                  quantity: number;
                  costPrice: number;
                }) => ({
                  productId: detail.productId,
                  quantity: detail.quantity,
                  costPrice: detail.costPrice,
                }),
              ),
            }
          : undefined,
      },
    });

    return res
      .status(200)
      .json({ message: 'Purchase updated successfully', updatedPurchase });
  } catch (error) {
    console.error(error);
    return handle500Response(
      res,
      error,
      'Failed to update purchase',
      'purchaseController.updatePurchase',
    );
  }
};

// Soft delete a purchase (admin only)
export const deletePurchase = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedPurchase = await writePrisma.purchase.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return res
      .status(200)
      .json({ message: 'Purchase deleted successfully', deletedPurchase });
  } catch (error) {
    console.error(error);
    return handle500Response(
      res,
      error,
      'Failed to delete purchase',
      'purchaseController.deletePurchase',
    );
  }
};

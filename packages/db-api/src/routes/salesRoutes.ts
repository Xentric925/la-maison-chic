import { Router } from 'express';
import {
  getAllSales,
  getSaleById,
  createSale,
  getPurchaseHistory,
  deleteSale,
} from '../controllers/saleController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

// Admin-only routes
router.get(
  '/sales',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  getAllSales,
);
router.get(
  '/sales/:id',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN, UserRole.USER]),
  getSaleById,
); // Admin or user if they own the sale
router.post('/sales', authMiddleware, createSale);
router.delete(
  '/sales/:id',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  deleteSale,
);

// User-specific routes
router.get('/sales/history', authMiddleware, getPurchaseHistory);

export default router;

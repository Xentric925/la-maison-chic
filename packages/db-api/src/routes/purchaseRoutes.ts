import { Router } from 'express';
import {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
} from '../controllers/purchaseController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.get(
  '/purchases',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  getAllPurchases,
);
router.get(
  '/purchases/:id',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  getPurchaseById,
);
router.post(
  '/purchases',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  createPurchase,
);
router.put(
  '/purchases/:id',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  updatePurchase,
);
router.delete(
  '/purchases/:id',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  deletePurchase,
);

export default router;

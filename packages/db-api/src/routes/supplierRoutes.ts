import { Router } from 'express';
import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplierController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.get(
  '/suppliers',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  getAllSuppliers,
);
router.get(
  '/suppliers/:id',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  getSupplierById,
);
router.post(
  '/suppliers',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  createSupplier,
);
router.put(
  '/suppliers/:id',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  updateSupplier,
);
router.delete(
  '/suppliers/:id',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  deleteSupplier,
);

export default router;

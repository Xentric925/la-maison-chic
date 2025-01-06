import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();
router.use(
  '/products',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN, UserRole.USER]),
);
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products', authRolesMiddleware([UserRole.ADMIN]), createProduct);
router.put(
  '/products/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  updateProduct,
);
router.delete(
  '/products/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  deleteProduct,
);

export default router;

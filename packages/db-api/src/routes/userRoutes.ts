import { Router } from 'express';
import {
  getCurrentUser,
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
} from '../controllers/userController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.get(
  '/users',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  getAllUsers,
);
router.get(
  '/users/me',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN, UserRole.USER]),
  getCurrentUser,
);
router.get(
  '/users/:id',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  getUserById,
);
router.post(
  '/users',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  createUser,
);
router.delete(
  '/users/:id',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  deleteUser,
);

export default router;

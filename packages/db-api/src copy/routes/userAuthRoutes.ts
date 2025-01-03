import express from 'express';
import { UserRole } from '@prisma/client';
import {
  loginWithEmail,
  logout,
  validateLoginToken,
} from '../controllers/userAuthController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.post(
  '/logout',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE]),
  logout,
);
router.post('/login', loginWithEmail);
router.post('/validate-token', validateLoginToken);

export default router;

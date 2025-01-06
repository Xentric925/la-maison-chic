import { Router } from 'express';
import {
  signUp,
  login,
  refreshToken,
  logout,
  validateLoginToken,
} from '../controllers/userAuthController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/validate-token', validateLoginToken);
router.post('/refresh-token', refreshToken);
router.post(
  '/logout',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN, UserRole.USER]),
  logout,
);

export default router;

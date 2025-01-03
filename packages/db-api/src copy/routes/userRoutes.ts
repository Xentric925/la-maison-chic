import express from 'express';

import {
  authMiddleware,
  authRolesMiddleware,
  authUserIdMiddleware,
} from '../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getAllUsersCount,
  getOrgHierarchy,
  getUserById,
  getUserTeams,
  updateUser,
  updateUserDetails,
} from '../controllers/userController';

const router = express.Router();

router.use(
  '/users',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE]),
);

router.get('/users', (req, res) => getAllUsers(req, res));
router.get('/users/count', getAllUsersCount);
router.get('/users/me', getUserById);
router.get('/users/org-hierarchy', getOrgHierarchy);
router.get('/users/:id', getUserById);
router.get(
  '/users/:id/teams',
  authMiddleware,
  authUserIdMiddleware,
  getUserTeams,
);

router.post(
  '/users',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  (req, res) => createUser(req, res),
);
router.put(
  '/users/:id',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  (req, res) => updateUser(req, res),
);
router.delete(
  '/users/:id',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
  (req, res) => deleteUser(req, res),
);
router.patch(
  '/users/:id/details',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN, UserRole.MANAGER]),
  (req, res) => updateUserDetails(req, res),
);

export default router;

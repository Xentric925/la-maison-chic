import express from 'express';
import { UserRole } from '@prisma/client';

import {
  createGroup,
  deleteGroup,
  getAllGroups,
  getAllGroupsCount,
  getGroupById,
  updateGroup,
  addGroupMember,
  removeGroupMember,
} from '../controllers/groupController';

import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use(
  '/groups',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN, UserRole.MANAGER]),
);

router.get('/groups', (req, res) => getAllGroups(req, res));
router.get('/groups/count', getAllGroupsCount);
router.get('/groups/:id', getGroupById);

router.post('/groups', authRolesMiddleware([UserRole.ADMIN]), createGroup);
router.put('/groups/:id', authRolesMiddleware([UserRole.ADMIN]), updateGroup);
router.delete(
  '/groups/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  deleteGroup,
);

// Adding and Removing Members
router.post(
  '/groups/:id/members',
  authRolesMiddleware([UserRole.ADMIN]),
  addGroupMember,
);
router.delete(
  '/groups/:id/members/:memberId',
  authRolesMiddleware([UserRole.ADMIN]),
  removeGroupMember,
);

export default router;

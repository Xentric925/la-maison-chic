import express from 'express';
import { UserRole } from '@prisma/client';

import {
  createTeam,
  deleteTeam,
  getAllTeams,
  getAllTeamsCount,
  getTeamById,
  updateTeam,
  addTeamMember,
  removeTeamMember,
} from '../controllers/teamController';

import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use(
  '/teams',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN, UserRole.MANAGER]),
);

router.get('/teams', (req, res) => getAllTeams(req, res));
router.get('/teams/count', getAllTeamsCount);
router.get('/teams/:id', getTeamById);

router.post('/teams', authRolesMiddleware([UserRole.ADMIN]), createTeam);
router.put('/teams/:id', authRolesMiddleware([UserRole.ADMIN]), updateTeam);
router.delete('/teams/:id', authRolesMiddleware([UserRole.ADMIN]), deleteTeam);

// Adding and Removing Members
router.post(
  '/teams/:id/members',
  authRolesMiddleware([UserRole.ADMIN]),
  addTeamMember,
);
router.delete(
  '/teams/:id/members/:memberId',
  authRolesMiddleware([UserRole.ADMIN]),
  removeTeamMember,
);

export default router;

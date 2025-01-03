import express from 'express';
import { UserRole } from '@prisma/client';

import { getGeneralLogs, getUserHistory } from '../controllers/logsController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use('/logs', authMiddleware, authRolesMiddleware([UserRole.ADMIN]));
// General logs
router.get('/logs/general', getGeneralLogs);
// User Specific Logs
router.get('/logs/user-history', getUserHistory);

export default router;

import express from 'express';
import { UserRole } from '@prisma/client';

import {
  createFeatureFlag,
  getFeatureFlags,
  updateFeatureFlag,
  deleteFeatureFlag,
} from '../controllers/featureFlagsController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use(
  '/feature-flags',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
);

router.get('/feature-flags', getFeatureFlags);
router.post('/feature-flags', createFeatureFlag);
router.put('/feature-flags/:id', updateFeatureFlag);
router.delete('/feature-flags/:id', deleteFeatureFlag);

export default router;

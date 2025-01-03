import express from 'express';
import { UserRole } from '@prisma/client';

import {
  createCompanySettings,
  getCompanySettings,
  updateCompanySettings,
  deleteCompanySettings,
  updateCompany,
} from '../controllers/companySettingsController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use(
  '/company-settings',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
);

router.get('/company/settings', getCompanySettings);
router.post('/company-settings', createCompanySettings);
router.put('/company-settings/:id', updateCompanySettings);
router.delete('/company-settings/:id', deleteCompanySettings);

// New route for updating company details
router.put(
  '/company/settings',
  authRolesMiddleware([UserRole.ADMIN]),
  updateCompany,
);

export default router;

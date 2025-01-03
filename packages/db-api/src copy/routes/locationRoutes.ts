import express from 'express';
import { UserRole } from '@prisma/client';

import {
  createLocation,
  deleteLocation,
  getAllLocations,
  getAllLocationsCount,
  getLocationById,
  updateLocation,
} from '../controllers/locationController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use(
  '/locations',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE]),
);

router.get('/locations', (req, res) => getAllLocations(req, res));
router.get('/locations/count', getAllLocationsCount);
router.get('/locations/:id', getLocationById);

router.post(
  '/locations',
  authRolesMiddleware([UserRole.ADMIN]),
  createLocation,
);
router.put(
  '/locations/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  updateLocation,
);
router.delete(
  '/locations/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  deleteLocation,
);

export default router;

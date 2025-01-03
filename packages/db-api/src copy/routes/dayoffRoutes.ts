import express from 'express';
import { UserRole } from '@prisma/client';

import {
  getDayoffs,
  createDayOff,
  updateDayOff,
  deleteDayOff,
  countFutureDayOffs,
} from '../controllers/dayoffController';

import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

// Apply middleware for authentication and authorization
router.use(
  '/dayoffs',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN, UserRole.MANAGER]),
);

// Get all day-offs
router.get('/dayoffs', getDayoffs);

// Count future day-offs
router.get('/dayoffs/count', countFutureDayOffs);

// Create a day-off
router.post('/dayoffs', authRolesMiddleware([UserRole.ADMIN]), createDayOff);

// Update a day-off
router.put('/dayoffs/:id', authRolesMiddleware([UserRole.ADMIN]), updateDayOff);

// Delete a day-off
router.delete(
  '/dayoffs/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  deleteDayOff,
);

export default router;

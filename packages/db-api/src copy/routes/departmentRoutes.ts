import express from 'express';
import { UserRole } from '@prisma/client';
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getAllDepartmentsCount,
  getDepartmentById,
  updateDepartment,
} from '../controllers/departmentController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use(
  '/departments',
  authMiddleware,
  authRolesMiddleware([UserRole.ADMIN]),
);

router.get('/departments', (req, res) => getAllDepartments(req, res));
router.get('/departments/count', getAllDepartmentsCount);
router.get('/departments/:id', getDepartmentById);

router.post('/departments', createDepartment);
router.put('/departments/:id', updateDepartment);
router.delete('/departments/:id', deleteDepartment);

export default router;

import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.patch(
  '/my-profile',
  validateRequest(AdminValidation.updateAdminZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.updateProfile
);

router.get(
  '/my-profile',
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.getMyProfile
);

router.post(
  '/create-admin',
  validateRequest(AdminValidation.createAdminZodSchema),
  AdminController.createAdmin
);
router.post(
  '/login',
  validateRequest(AdminValidation.adminLoginZodSchema),
  AdminController.adminLogin
);

export const AdminRoutes = router;

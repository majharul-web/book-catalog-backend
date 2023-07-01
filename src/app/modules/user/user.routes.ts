import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import checkSpecificUser from '../../middlewares/checkSpecificUser';

const router = express.Router();

router.patch(
  '/my-profile',
  validateRequest(UserValidation.updateUserZodSchema),
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  checkSpecificUser,
  UserController.updateProfile
);

router.get(
  '/my-profile',
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  checkSpecificUser,
  UserController.getMyProfile
);

router.patch(
  '/:id',
  validateRequest(UserValidation.updateUserZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  UserController.updateUser
);

router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.getSingleUser);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  UserController.deleteSingleUser
);

router.get('/', auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUsers);

export const UserRoutes = router;

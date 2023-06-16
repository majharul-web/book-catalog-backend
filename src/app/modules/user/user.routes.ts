import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

router.patch(
  '/:id',
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateUser
);

router.get('/:id', UserController.getSingleUser);
router.delete('/:id', UserController.deleteSingleUser);
router.get('/', UserController.getAllUsers);

export const UserRoutes = router;

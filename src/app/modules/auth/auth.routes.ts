import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { UserValidation } from '../user/user.validation';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(UserValidation.createUserZodSchema),
  AuthController.signUp
);

export const AuthRoutes = router;

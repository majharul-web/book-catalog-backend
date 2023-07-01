import express from 'express';
import { CowController } from './cow.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CowValidation } from './cow.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import checkSellerAuthorization from '../../middlewares/checkSellerAuthorization';

const router = express.Router();

router.post(
  '/create-cow',
  validateRequest(CowValidation.createCowZodSchema),
  auth(ENUM_USER_ROLE.SELLER),
  CowController.createCow
);

router.patch(
  '/:id',
  validateRequest(CowValidation.updateCowZodSchema),
  auth(ENUM_USER_ROLE.SELLER),
  checkSellerAuthorization,
  CowController.updateCow
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SELLER),
  checkSellerAuthorization,
  CowController.deleteSingleCow
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN),
  CowController.getSingleCow
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN),
  CowController.getAllCows
);

export const CowRoutes = router;

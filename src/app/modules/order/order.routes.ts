import express from 'express';
import { OrderController } from './order.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './order.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import checkOrderAuthorization from '../../middlewares/checkOrderAuthorization';
import checkSpecificUser from '../../middlewares/checkSpecificUser';

const router = express.Router();

router.post(
  '/',
  validateRequest(OrderValidation.createOrderZodSchema),
  auth(ENUM_USER_ROLE.BUYER),
  OrderController.createOrder
);
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),
  checkSpecificUser,
  checkOrderAuthorization,
  OrderController.getSingleOrder
);
router.get(
  '/',
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),
  checkSpecificUser,
  checkOrderAuthorization,
  OrderController.getAllOrders
);

export const OrderRoutes = router;

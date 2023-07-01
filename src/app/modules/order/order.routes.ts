import express from 'express';
import { OrderController } from './order.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './order.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

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
  OrderController.getSingleOrder
);
router.get(
  '/',
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),

  OrderController.getOrders
);

export const OrderRoutes = router;

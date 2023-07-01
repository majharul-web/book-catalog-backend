import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import { jwtHelper } from '../../helpers/jwtHelper';
import httpStatus from 'http-status';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import { Order } from '../modules/order/order.model';

const checkOrderAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = req.params.id;

    // Get authorization token
    const token = req.headers.authorization;
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    const verifiedUser = jwtHelper.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const { role, _id } = verifiedUser;

    if (role === 'seller') {
      res.send('You are a seller');
      // next();
    } else if (role === 'buyer') {
      if (orderId) {
        const order = await Order.findOne({ _id: orderId, buyer: _id });

        if (order && order.buyer._id && order.buyer._id == _id) {
          // Seller is authorized, proceed to the next middleware or route handler
          next();
        } else {
          // Seller is not authorized to perform the operation
          throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
        }
      } else {
        const orders = await Order.find({ buyer: _id });

        if (orders && orders[0].buyer._id && orders[0].buyer._id == _id) {
          // Seller is authorized, proceed to the next middleware or route handler
          next();
        } else {
          // Seller is not authorized to perform the operation
          throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

export default checkOrderAuthorization;

import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import { jwtHelper } from '../../helpers/jwtHelper';
import httpStatus from 'http-status';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import { Order } from '../modules/order/order.model';
import { ICow } from '../modules/cow/cow.interface';

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

    if (role === 'admin') {
      next();
    } else if (role === 'seller') {
      if (orderId) {
        const order = await Order.findOne({ _id: orderId })
          .populate({
            path: 'cow',
            match: { seller: _id },
          })
          .populate('buyer')
          .exec();

        if (order && order.cow && (order.cow as ICow).seller._id == _id) {
          next();
        } else {
          throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
        }
      } else {
        // const orders = await Order.aggregate([
        //   {
        //     $match: {
        //       'cow.seller._id': _id,
        //     },
        //   },
        // ]);

        // res.json({
        //   order: orders,
        //   status: 200,
        // });

        next();
      }
    } else if (role === 'buyer') {
      if (orderId) {
        const order = await Order.findOne({ _id: orderId, buyer: _id });
        if (order && order.buyer._id && order.buyer._id == _id) {
          next();
        } else {
          throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
        }
      } else {
        const orders = await Order.find({ buyer: _id });
        if (
          orders.length &&
          orders[0].buyer._id &&
          orders[0].buyer._id == _id
        ) {
          next();
        } else {
          throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

export default checkOrderAuthorization;

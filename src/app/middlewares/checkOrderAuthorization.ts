import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import { jwtHelper } from '../../helpers/jwtHelper';
import httpStatus from 'http-status';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import { Order } from '../modules/order/order.model';
import { ICow } from '../modules/cow/cow.interface';
import { ObjectId } from 'mongodb';

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
        const orders = await Order.aggregate([
          {
            $lookup: {
              from: 'cows', // Assuming the collection name for cows is 'cows'
              localField: 'cow',
              foreignField: '_id',
              as: 'cow',
            },
          },
          {
            $unwind: '$cow',
          },
          {
            $lookup: {
              from: 'users', // Assuming the collection name for users is 'users'
              localField: 'cow.seller',
              foreignField: '_id',
              as: 'cow.seller',
            },
          },
          {
            $unwind: '$cow.seller',
          },
          {
            $match: {
              $and: [
                { 'cow.seller._id': new ObjectId(_id) },
                { buyer: { $exists: true } },
              ],
            },
          },
          {
            $lookup: {
              from: 'users', // Assuming the collection name for users is 'users'
              localField: 'buyer',
              foreignField: '_id',
              as: 'buyer',
            },
          },
          {
            $unwind: '$buyer',
          },
        ]);

        // Note: Make sure to import the ObjectId from the MongoDB driver

        res.send(orders);
        if (orders.length && orders[0].cow) {
          next();
        } else {
          throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
        }
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

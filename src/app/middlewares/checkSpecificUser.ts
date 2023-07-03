import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelper } from '../../helpers/jwtHelper';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import { User } from '../modules/user/user.model';
import { Admin } from '../modules/admin/admin.model';

const checkSpecificUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    // const refreshToken = req.cookies.refreshToken;
    // if (!refreshToken) {
    //   throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    // }

    // const verifiedUser = jwtHelper.verifyToken(
    //   refreshToken,
    //   config.jwt.refresh_secret as Secret
    // );

    const { role, _id } = jwtHelper.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    // if (_id !== verifiedUser._id) {
    //   throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    // }

    let user;
    if (role === 'admin') {
      user = await Admin.findOne({ _id: _id, role: role });
    } else {
      user = await User.findOne({ _id: _id, role: role });
    }

    // Check if the sellerId matches the authenticated seller's _id

    if (user && user._id && user._id == _id) {
      // Seller is authorized, proceed to the next middleware or route handler
      next();
    } else {
      // Seller is not authorized to perform the operation
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
    }
  } catch (error) {
    next(error);
  }
};

export default checkSpecificUser;

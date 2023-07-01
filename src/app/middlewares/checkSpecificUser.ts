import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelper } from '../../helpers/jwtHelper';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import { User } from '../modules/user/user.model';

const checkSpecificUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  const verifiedUser = jwtHelper.verifyToken(
    token,
    config.jwt.secret as Secret
  );
  const { role, _id } = verifiedUser; // Assuming the authenticated user's _id is stored

  try {
    const user = await User.findOne({ _id: _id, role: role });

    // Check if the sellerId matches the authenticated seller's _id

    if (user && user._id && user._id == _id) {
      // Seller is authorized, proceed to the next middleware or route handler
      next();
    } else {
      // Seller is not authorized to perform the operation
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
    }
  } catch (error) {
    next(error);
  }
};

export default checkSpecificUser;

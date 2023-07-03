import { NextFunction, Request, Response } from 'express';
import { Cow } from '../modules/cow/cow.model';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelper } from '../../helpers/jwtHelper';
import config from '../../config';
import { Secret } from 'jsonwebtoken';

const checkSellerAuthorization = async (
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
  const sellerId = verifiedUser._id; // Assuming the authenticated user's _id is stored in req.user._id
  const cowId = req.params.id;

  try {
    const cow = await Cow.findOne({ seller: sellerId, _id: cowId });
    // Check if the sellerId matches the authenticated seller's _id
    if (cow && cow.seller._id && cow.seller._id == sellerId) {
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

export default checkSellerAuthorization;

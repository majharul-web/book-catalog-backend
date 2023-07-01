// import { NextFunction, Request, Response } from 'express';
// import ApiError from '../../errors/ApiError';
// import { jwtHelper } from '../../helpers/jwtHelper';
// import httpStatus from 'http-status';
// import config from '../../config';
// import { Secret } from 'jsonwebtoken';
// import { Order } from '../modules/order/order.model';

// const checkOrderAuthorization = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const orderId = req.params.id;

//     //get authorization token
//     const token = req.headers.authorization;
//     if (!token) {
//       throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
//     }

//     const verifiedUser = jwtHelper.verifyToken(
//       token,
//       config.jwt.secret as Secret
//     );

//     if (verifiedUser.role === 'seller') {
//       const orders = await Order.find({ seller: verifiedUser._id });
//       res.send('You are a seller');
//       // next();
//     } else if (verifiedUser.role === 'buyer') {
//       res.send('You are a buyer');
//       // next();
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// export default checkOrderAuthorization;

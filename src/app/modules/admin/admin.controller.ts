import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './admin.service';
import { IAdmin } from './admin.interface';
import config from '../../../config';
import { ILoginResponse } from '../../../interfaces/auth';
import { Secret } from 'jsonwebtoken';
import { jwtHelper } from '../../../helpers/jwtHelper';
import ApiError from '../../../errors/ApiError';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const adminData = req.body;
  const result = await AdminService.createAdmin(adminData);

  sendResponse<Partial<IAdmin>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'admin created successfully!',
    data: result,
  });
});

const adminLogin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AdminService.adminLogin(loginData);
  const { refreshToken, ...others } = result;

  // set refresh token in cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'admin logged in successfully!',
    data: others,
  });
});

// profile section
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }
  // verify token

  // eslint-disable-next-line no-unused-vars
  const { role, _id } = jwtHelper.verifyToken(
    token,
    config.jwt.secret as Secret
  );

  const result = await AdminService.getSingleAdmin(_id);

  sendResponse<IAdmin>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin information retrieved successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body;
  const token = req.headers.authorization;
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }
  // verify token

  // eslint-disable-next-line no-unused-vars
  const { role, _id } = jwtHelper.verifyToken(
    token,
    config.jwt.secret as Secret
  );

  const result = await AdminService.updateProfile(_id, userData);

  sendResponse<IAdmin>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin information updated successfully',
    data: result,
  });
});

export const AdminController = {
  createAdmin,
  adminLogin,
  getMyProfile,
  updateProfile,
};

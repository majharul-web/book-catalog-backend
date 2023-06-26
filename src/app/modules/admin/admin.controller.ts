import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './admin.service';
import { IAdmin, ILoginAdminResponse } from './admin.interface';
import config from '../../../config';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const adminData = req.body;
  const result = await AdminService.createAdmin(adminData);

  sendResponse<IAdmin>(res, {
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

  sendResponse<ILoginAdminResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'admin logged in successfully!',
    data: others,
  });
});

export const AdminController = {
  createAdmin,
  adminLogin,
};

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from '../user/user.interface';
import { AuthService } from './auth.service';
import config from '../../../config';
import { ILoginResponse } from '../../../interfaces/auth';

const signUp = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body;
  const result = await AuthService.signUp(userData);

  sendResponse<Partial<IUser>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user created successfully!',
    data: result,
  });
});

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const loginData = req.body;

  const result = await AuthService.userLogin(loginData);

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
    message: 'user logged in successfully!',
    data: others,
  });
});

export const AuthController = {
  signUp,
  userLogin,
};

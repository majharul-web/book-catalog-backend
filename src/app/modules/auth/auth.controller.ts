import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from '../user/user.interface';
import { AuthService } from './auth.service';

const signUp = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body;
  const result = await AuthService.signUp(userData);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user created successfully!',
    data: result,
  });
});

export const AuthController = {
  signUp,
};

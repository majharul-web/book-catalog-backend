import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './admin.service';
import { IAdmin } from './admin.interface';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body;
  const result = await AdminService.createAdmin(userData);

  sendResponse<IAdmin>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'admin created successfully!',
    data: result,
  });
});

export const AdminController = {
  createAdmin,
};

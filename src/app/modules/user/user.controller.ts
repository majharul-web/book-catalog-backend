import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import { UserService } from './user.service';
import pick from '../../../shared/pick';
import { paginationField } from '../../../constants/paginations';
import { userFilterableFields } from './user.constant';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const paginationOptions = pick(req.query, paginationField);

  const result = await UserService.getAllUsers(filters, paginationOptions);

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.getSingleUser(id);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user retrieved successfully!',
    data: result,
  });
});
const deleteSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.deleteSingleUser(id);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user deleted successfully!',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userData = req.body;
  const result = await UserService.updateUser(id, userData);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user updated successfully!',
    data: result,
  });
});

export const UserController = {
  getSingleUser,
  deleteSingleUser,
  updateUser,
  getAllUsers,
};

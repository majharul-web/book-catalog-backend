import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CowService } from './cow.service';
import { ICow } from './cow.interface';
import pick from '../../../shared/pick';
import { paginationField } from '../../../constants/paginations';
import { cowFilterableFields } from './cow.constant';

const createCow = catchAsync(async (req: Request, res: Response) => {
  const cowData = req.body;
  const result = await CowService.createCow(cowData);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'cow created successfully!',
    data: result,
  });
});

const getAllCows = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowFilterableFields);

  const paginationOptions = pick(req.query, paginationField);

  const result = await CowService.getAllCows(filters, paginationOptions);

  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCow = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CowService.getSingleCow(id);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'cow retrieved successfully!',
    data: result,
  });
});

const deleteSingleCow = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CowService.deleteSingleCow(id);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'cow deleted successfully!',
    data: result,
  });
});

const updateCow = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const cowData = req.body;
  const result = await CowService.updateCow(id, cowData);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'cow updated successfully!',
    data: result,
  });
});

export const CowController = {
  createCow,
  getSingleCow,
  deleteSingleCow,
  updateCow,
  getAllCows,
};

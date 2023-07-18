import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IReadinglist } from './readinglist.interface';
import { Request, Response } from 'express';
import { ReadinglistService } from './readinglist.service';
import pick from '../../../shared/pick';
import { paginationField } from '../../../constants/paginations';

const addToReadinglist = catchAsync(async (req: Request, res: Response) => {
  const { bookId, userId } = req.body;
  const result = await ReadinglistService.addToReadinglist(bookId, userId);

  sendResponse<IReadinglist>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Add to readinglist successfully!',
    data: result,
  });
});

const getAllReadinglists = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const paginationOptions = pick(req.query, paginationField);

  const result = await ReadinglistService.getAllReadinglists(
    paginationOptions,
    id
  );

  sendResponse<IReadinglist[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Readinglist retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const deleteSingleReadinglist = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ReadinglistService.deleteSingleReadinglist(id);

    sendResponse<IReadinglist>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'readinglist deleted successfully!',
      data: result,
    });
  }
);

const updateReadinglist = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const readinglistData = req.body;
  const result = await ReadinglistService.updateReadinglist(
    id,
    readinglistData
  );

  sendResponse<IReadinglist>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'readinglist status updated successfully!',
    data: result,
  });
});

export const ReadinglistController = {
  addToReadinglist,
  getAllReadinglists,
  deleteSingleReadinglist,
  updateReadinglist,
};

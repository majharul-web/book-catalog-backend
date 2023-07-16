import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IBook } from './book.interface';
import { Request, Response } from 'express';
import { BookService } from './book.service';
import pick from '../../../shared/pick';
import { paginationField } from '../../../constants/paginations';
import { bookFilterableFields } from './book.constant';

const createBook = catchAsync(async (req: Request, res: Response) => {
  const bookData = req.body;
  const result = await BookService.createBook(bookData);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'book created successfully!',
    data: result,
  });
});

const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bookFilterableFields);

  const paginationOptions = pick(req.query, paginationField);

  const result = await BookService.getAllBooks(filters, paginationOptions);

  sendResponse<IBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BookService.getSingleBook(id);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'book retrieved successfully!',
    data: result,
  });
});
const deleteSingleBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BookService.deleteSingleBook(id);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'book deleted successfully!',
    data: result,
  });
});

const updateBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const bookData = req.body;
  const result = await BookService.updateBook(id, bookData);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'book updated successfully!',
    data: result,
  });
});

const reviewBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const reviewData = req.body;
  const result = await BookService.reviewBook(id, reviewData);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'book review updated successfully!',
    data: result,
  });
});

export const BookController = {
  createBook,
  getAllBooks,
  getSingleBook,
  deleteSingleBook,
  updateBook,
  reviewBook,
};

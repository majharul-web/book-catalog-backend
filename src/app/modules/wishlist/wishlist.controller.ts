import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IWishlist } from './wishlist.interface';
import { Request, Response } from 'express';
import { WishlistService } from './wishlist.service';
import pick from '../../../shared/pick';
import { paginationField } from '../../../constants/paginations';

const addToWishlist = catchAsync(async (req: Request, res: Response) => {
  const { bookId, userId } = req.body;
  const result = await WishlistService.addToWishlist(bookId, userId);

  sendResponse<IWishlist>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Add to wishlist successfully!',
    data: result,
  });
});

const getAllWishlists = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const paginationOptions = pick(req.query, paginationField);

  const result = await WishlistService.getAllWishlists(paginationOptions, id);

  sendResponse<IWishlist[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wishlist retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const deleteSingleWishlist = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WishlistService.deleteSingleWishlist(id);

  sendResponse<IWishlist>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'wishlist deleted successfully!',
    data: result,
  });
});

export const WishlistController = {
  addToWishlist,
  getAllWishlists,
  deleteSingleWishlist,
};

import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IWishlist } from './wishlist.interface';
import { Wishlist } from './wishlist.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { Book } from '../book/book.model';
import { User } from '../user/user.model';

const addToWishlist = async (
  bookId: string,
  userId: string
): Promise<IWishlist | null> => {
  const isExistBook = await Book.findOne({ _id: bookId });
  const isExistUser = await User.findOne({ _id: userId });

  if (!isExistBook) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found!');
  }
  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const result = await Wishlist.create({ book: bookId, user: userId });
  return result;
};

const getAllWishlists = async (
  paginationOptions: IPaginationOptions,
  userId: string
): Promise<IGenericResponse<IWishlist[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Wishlist.find({
    user: userId,
  })
    .populate('book')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Wishlist.countDocuments({});

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const deleteSingleWishlist = async (id: string): Promise<IWishlist | null> => {
  const result = await Wishlist.findOneAndDelete({ _id: id });
  return result;
};

export const WishlistService = {
  addToWishlist,
  deleteSingleWishlist,
  getAllWishlists,
};

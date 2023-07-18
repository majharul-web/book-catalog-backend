import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { bookSearchableFields } from './book.constant';
import { IBook, IBookFilters, IBookReview } from './book.interface';
import { Book } from './book.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createBook = async (book: IBook): Promise<IBook | null> => {
  const result = await Book.create(book);
  return result;
};

const getAllBooks = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBook[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: bookSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: { $regex: new RegExp(value, 'i') },
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Book.find(whereConditions)
    .populate('createdBy')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleBook = async (id: string): Promise<IBook | null> => {
  const result = await Book.findOne({ _id: id }).populate('createdBy');
  return result;
};

const deleteSingleBook = async (id: string): Promise<IBook | null> => {
  const result = await Book.findOneAndDelete({ _id: id });
  return result;
};

const updateBook = async (
  id: string,
  payload: Partial<IBook>
): Promise<IBook | null> => {
  const isExist = await Book.findOne({ _id: id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found !');
  }

  const result = await Book.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const reviewBook = async (
  id: string,
  payload: Partial<IBookReview>
): Promise<IBook | null> => {
  const isExist = await Book.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found!');
  }

  // Create a new review object
  const review = {
    rating: payload.rating,
    comment: payload.comment,
  };

  // Update the book's reviews array with the new review
  const result = await Book.findOneAndUpdate(
    { _id: id },
    { $push: { reviews: review } }, // Use $push to add the review to the reviews array
    { new: true }
  );

  return result;
};

export const BookService = {
  createBook,
  getSingleBook,
  deleteSingleBook,
  updateBook,
  getAllBooks,
  reviewBook,
};

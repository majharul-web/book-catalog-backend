import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IReadinglist } from './readinglist.interface';
import { Readinglist } from './readinglist.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { Book } from '../book/book.model';

const addToReadinglist = async (
  payload: string
): Promise<IReadinglist | null> => {
  const isExistBook = await Book.findOne({ _id: payload });

  if (!isExistBook) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found!');
  }

  const result = await Readinglist.create({ book: payload });
  return result;
};

const getAllReadinglists = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IReadinglist[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Readinglist.find({})
    .populate('book')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Readinglist.countDocuments({});

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const deleteSingleReadinglist = async (
  id: string
): Promise<IReadinglist | null> => {
  const result = await Readinglist.findOneAndDelete({ _id: id });
  return result;
};

const updateReadinglist = async (
  id: string,
  payload: any
): Promise<IReadinglist | null> => {
  const result = await Readinglist.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const ReadinglistService = {
  addToReadinglist,
  deleteSingleReadinglist,
  getAllReadinglists,
  updateReadinglist,
};

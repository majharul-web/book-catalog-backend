import httpStatus from 'http-status';
import { ICow, ICowFilters } from './cow.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { cowSearchableFields } from './cow.constant';
import { SortOrder } from 'mongoose';
import { Cow } from './cow.model';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';

const getAllCows = async (
  filters: ICowFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICow[]>> => {
  const { searchTerm, minPrice, maxPrice, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (minPrice) {
    andConditions.push({ price: { $gte: minPrice } });
  }

  if (maxPrice) {
    andConditions.push({ price: { $lte: maxPrice } });
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

  const result = await Cow.find(whereConditions)
    .populate('seller')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Cow.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const createCow = async (cow: ICow): Promise<ICow | null> => {
  const { seller } = cow;

  // Check if the seller is exist or not
  const sellerAccount = await User.findById(seller);

  if (!sellerAccount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid seller ID.');
  }
  if (sellerAccount.role !== 'seller') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You arr not a seller , Only seller can not add a cow !'
    );
  }
  const existingCow = await Cow.findOne({
    name: cow.name,
    age: cow.age,
    price: cow.price,
    location: cow.location,
    breed: cow.breed,
    weight: cow.weight,
    label: 'for sale',
    category: cow.category,
    seller: seller,
  });

  if (existingCow) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This cow already exists with the same seller.'
    );
  }

  const result = await Cow.create(cow);
  return result;
};

const getSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findOne({ _id: id }).populate('seller');
  return result;
};

const deleteSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findOneAndDelete({ _id: id });
  return result;
};

const updateCow = async (
  id: string,
  payload: Partial<ICow>
): Promise<ICow | null> => {
  const isExist = await Cow.findOne({ _id: id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow not found !');
  }

  const result = await Cow.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const CowService = {
  createCow,
  getSingleCow,
  deleteSingleCow,
  updateCow,
  getAllCows,
};

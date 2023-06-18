import mongoose, { SortOrder } from 'mongoose';
import { IOrder, IOrderFilters } from './order.interface';
import { Order } from './order.model';
import { generateOrderId } from './order.utils';
import { orderSearchableFields } from './order.constant';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { Cow } from '../cow/cow.model';
import { User } from '../user/user.model';

const createOrderOld = async (orderData: IOrder): Promise<IOrder | null> => {
  const { cow, buyer } = orderData;

  // Check if the buyer has enough money to buy the cow
  const buyerAccount = await User.findById(buyer);
  const cowDetails = await Cow.findById(cow).populate('seller');

  if (!buyerAccount || !cowDetails) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid buyer or cow ID.');
  }
  if (buyerAccount.role !== 'buyer') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You arr not a buyer ,Only buyers can order cow .'
    );
  }

  if (buyerAccount.budget < cowDetails.price) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not enough money.');
  }
  if (cowDetails.label === 'sold out') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cow is already sold out.');
  }

  let allOderData;
  const session = await mongoose.startSession();
  try {
    // Start a new Mongoose session for the transaction
    session.startTransaction();

    // Update cow's status to 'sold out'
    cowDetails.label = 'sold out';
    await cowDetails.save({ session });

    // Deduct the cost of the cow from the buyer's budget
    buyerAccount.budget -= cowDetails.price;
    await buyerAccount.save({ session });

    // Add the same amount of cost to the seller's income
    const sellerAccount = await User.findById(cowDetails.seller._id);
    if (!sellerAccount) {
      session.abortTransaction();
      session.endSession();
      throw new ApiError(httpStatus.BAD_REQUEST, 'Seller not found');
    }
    sellerAccount.income += cowDetails.price;
    await sellerAccount.save({ session });

    const id = await generateOrderId();

    // Create a new order entry
    const order = new Order({
      id,
      cow,
      buyer,
    });
    await order.save({ session });

    allOderData = order;

    // Commit the transaction
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (allOderData) {
    allOderData = await Order.findOne({ id: allOderData.id })
      .populate({
        path: 'cow',
        populate: {
          path: 'seller',
        },
      })
      .populate('buyer');
  }
  return allOderData;
};

const createOrder = async (orderData: IOrder): Promise<IOrder | null> => {
  const { cow, buyer } = orderData;

  // Check if the buyer has enough money to buy the cow
  const buyerAccount = await User.findById(buyer);
  const cowDetails = await Cow.findById(cow).populate('seller');

  if (!buyerAccount || !cowDetails) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid buyer or cow ID.');
  }
  if (buyerAccount.role !== 'buyer') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You arr not a buyer ,Only buyers can order cow .'
    );
  }

  if (buyerAccount.budget < cowDetails.price) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not enough money.');
  }
  if (cowDetails.label === 'sold out') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cow is already sold out.');
  }

  let allOrderData;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Update cow's status to 'sold out'
    const updatedCow = await Cow.findOneAndUpdate(
      { _id: cow },
      { $set: { label: 'sold out' } },
      { session }
    );

    if (!updatedCow) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update cow label');
    }

    // Deduct the cost of the cow from the buyer's budget
    const updatedBuyer = await User.findOneAndUpdate(
      { _id: buyer },
      { $inc: { budget: -cowDetails.price } },
      { session }
    );
    if (!updatedBuyer) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to update buyer budget'
      );
    }

    const sellerAccount = await User.findOneAndUpdate(
      { _id: cowDetails.seller._id },
      { $inc: { income: cowDetails.price } },
      { new: true, session }
    );

    if (!sellerAccount) {
      session.abortTransaction();
      session.endSession();
      throw new ApiError(httpStatus.BAD_REQUEST, 'Seller not found');
    }

    const id = await generateOrderId();

    // Create a new order entry
    // const order = new Order({
    //   id,
    //   cow,
    //   buyer,
    // });
    // await order.save({ session });

    const newOrder = {
      id,
      cow,
      buyer,
    };
    const order = await Order.create([newOrder], { session });

    if (!order.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create order');
    }

    allOrderData = order[0];

    // Commit the transaction
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (allOrderData) {
    allOrderData = await Order.findOne({ id: allOrderData.id })
      .populate({
        path: 'cow',
        populate: {
          path: 'seller',
        },
      })
      .populate('buyer');
  }
  return allOrderData;
};

const getAllCows = async (
  filters: IOrderFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IOrder[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: orderSearchableFields.map(field => ({
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
        [field]: { $regex: new RegExp(String(value), 'i') },
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Order.find(whereConditions)
    .populate('cow')
    .populate('buyer')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const OrderService = {
  createOrder,
  getAllCows,
  createOrderOld,
};

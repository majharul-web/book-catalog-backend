import { Model, Types } from 'mongoose';
import { ICow } from '../cow/cow.interface';
import { IUser } from '../user/user.interface';

export type IOrder = {
  id: string;
  cow: Types.ObjectId | ICow;
  buyer: Types.ObjectId | IUser;
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;

export type IOrderFilters = {
  searchTerm?: string;
  id?: number;
};

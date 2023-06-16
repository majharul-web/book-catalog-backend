import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type ICow = {
  name: string;
  age: string;
  price: string;
  location: string;
  breed: string;
  weight: string;
  label: string;
  category: string;
  seller: Types.ObjectId | IUser;
};
export type CowModel = Model<ICow, Record<string, unknown>>;

export type ICowFilters = {
  searchTerm?: string;
  location?: string;
  breed?: string;
  category?: string;
  weight?: string;
  age?: string;
  seller?: string;
};

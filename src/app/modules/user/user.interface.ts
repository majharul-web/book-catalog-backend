import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IUser = {
  role: string;
  password: string;
  name: UserName; //embedded object
  phoneNumber: string;
  address: string;
  budget: number;
  income: number;
};
export type UserModel = Model<IUser, Record<string, unknown>>;

export type IUserFilters = {
  searchTerm?: string;
  phoneNumber?: string;
  address?: string;
  role?: string;
};

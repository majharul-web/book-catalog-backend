/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IUser = {
  _id?: string;
  role: string;
  password: string;
  name: UserName; //embedded object
  phoneNumber: string;
  address: string;
};

export type UserModel = {
  isUserExistByPhone: (
    phoneNumber: string
  ) => Promise<Pick<IUser, 'phoneNumber' | '_id' | 'password' | 'role'>>;
  isUserExistById: (
    _id: string
  ) => Promise<Pick<IUser, 'phoneNumber' | '_id' | 'password' | 'role'>>;
  isPasswordMatched: (
    givenPassword: string,
    savePassword: string
  ) => Promise<boolean>;
} & Model<IUser>;

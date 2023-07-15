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
  email: string;
  phoneNumber?: string;
  address: string;
};

export type UserModel = {
  isUserExistByPhone: (
    phoneNumber: string
  ) => Promise<Pick<IUser, 'phoneNumber' | '_id' | 'password' | 'role'>>;
  isUserExistByEmail: (
    email: string
  ) => Promise<Pick<IUser, 'email' | '_id' | 'password' | 'role'>>;
  isPasswordMatched: (
    givenPassword: string,
    savePassword: string
  ) => Promise<boolean>;
} & Model<IUser>;

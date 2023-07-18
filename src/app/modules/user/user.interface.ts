/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IUser = {
  _id?: string;
  role: string;
  password: string;
  name: string;
  email: string;
  address: string;
};

export type UserModel = {
  isUserExistByEmail: (
    email: string
  ) => Promise<Pick<IUser, 'email' | '_id' | 'password' | 'role'>>;
  isPasswordMatched: (
    givenPassword: string,
    savePassword: string
  ) => Promise<boolean>;
} & Model<IUser>;

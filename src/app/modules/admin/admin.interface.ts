import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  lastName: string;
  middleName: string;
};

export type IAdmin = {
  name: UserName; //embedded object
  phoneNumber: string;
  role: string;
  password: string;
  address: string;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>>;

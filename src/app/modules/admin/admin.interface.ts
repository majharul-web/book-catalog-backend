/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type AdminName = {
  firstName: string;
  lastName: string;
};

export type IAdmin = {
  _id?: string;
  name: AdminName; //embedded object
  phoneNumber: string;
  role: string;
  password: string;
  address: string;
};

// export type AdminModel = Model<IAdmin, Record<string, unknown>>;

export type AdminModel = {
  isAdminExist: (
    id: string
  ) => Promise<Pick<IAdmin, 'phoneNumber' | '_id' | 'password' | 'role'>>;
  isPasswordMatched: (
    givenPassword: string,
    savePassword: string
  ) => Promise<boolean>;
} & Model<IAdmin>;

export type ILoginAdmin = {
  phoneNumber: string;
  password: string;
};

export type ILoginAdminResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

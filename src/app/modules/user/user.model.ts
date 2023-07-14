import bcrypt from 'bcrypt';
/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { userRole } from './user.constant';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import config from '../../../config';

const userSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      required: true,
      enum: userRole,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: 0,
    },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// create static method
userSchema.statics.isUserExistByPhone = async function (
  phoneNumber: string
): Promise<Pick<IUser, 'phoneNumber' | '_id' | 'password' | 'role'> | null> {
  return await User.findOne(
    { phoneNumber: phoneNumber },
    {
      phoneNumber: 1,
      password: 1,
      role: 1,
    }
  );
};

userSchema.statics.isUserExistById = async function (
  _id: string
): Promise<Pick<IUser, 'phoneNumber' | '_id' | 'password' | 'role'> | null> {
  return await User.findOne(
    { _id: _id },
    {
      phoneNumber: 1,
      password: 1,
      role: 1,
    }
  );
};

// check password is matched
userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savePassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savePassword);
};

userSchema.pre('save', async function (next) {
  const isExist = await User.findOne({
    phoneNumber: this.phoneNumber,
  });
  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Phone number already exist');
  }
  next();
});

// hash password
userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds)
  );
  next();
});

export const User = model<IUser, UserModel>('User', userSchema);

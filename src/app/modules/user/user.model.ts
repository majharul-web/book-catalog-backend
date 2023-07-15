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
      type: String,
      required: true,
    },

    email: {
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

userSchema.statics.isUserExistByEmail = async function (
  email: string
): Promise<Pick<IUser, 'email' | '_id' | 'password' | 'role'> | null> {
  console.log('email', email);
  return await User.findOne(
    { email: email },
    {
      email: 1,
      _id: 1,
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
    email: this.email,
  });
  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Email number already exist');
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

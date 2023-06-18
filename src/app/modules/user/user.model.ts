import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { userRole } from './user.constant';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

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
    budget: {
      type: Number,
      required: true,
    },
    income: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.pre('save', async function (next) {
  const isExist = await User.findOne({
    phoneNumber: this.phoneNumber,
  });
  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Phone number already exist');
  }
  next();
});

export const User = model<IUser, UserModel>('User', userSchema);

/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IAdmin, AdminModel } from './admin.interface';
import config from '../../../config';
import bcrypt from 'bcrypt';

export const AdminSchema = new Schema<IAdmin, AdminModel>(
  {
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
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: ['admin'],
      required: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
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
AdminSchema.statics.isAdminExist = async function (
  phoneNumber: string
): Promise<Pick<IAdmin, 'phoneNumber' | '_id' | 'password' | 'role'> | null> {
  return await Admin.findOne(
    { phoneNumber: phoneNumber },
    {
      phoneNumber: 1,
      password: 1,
      role: 1,
    }
  );
};

// check password is matched
AdminSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savePassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savePassword);
};

// hash password
AdminSchema.pre('save', async function (next) {
  const admin = this;
  admin.password = await bcrypt.hash(
    admin.password,
    Number(config.bycrypt_salt_rounds)
  );
  next();
});

export const Admin = model<IAdmin, AdminModel>('Admin', AdminSchema);

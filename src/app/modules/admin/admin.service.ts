import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { ILogin, ILoginResponse } from '../../../interfaces/auth';
import bcrypt from 'bcrypt';

const createAdmin = async (
  payload: IAdmin
): Promise<Partial<IAdmin> | null> => {
  const result = await Admin.create(payload);

  if (result) {
    // eslint-disable-next-line no-unused-vars
    const { password, ...dataWithoutPassword } = result.toJSON();
    return dataWithoutPassword;
  }
  return null;
};

const adminLogin = async (payload: ILogin): Promise<ILoginResponse> => {
  const { phoneNumber, password } = payload;

  // check Admin is exist
  const isAdminExist = await Admin.isAdminExist(phoneNumber);

  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  // check password is match
  if (
    isAdminExist.password &&
    !(await Admin.isPasswordMatched(password, isAdminExist?.password))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password not match');
  }

  // create access token
  const accessToken = jwtHelper.createToken(
    { _id: isAdminExist._id, role: isAdminExist.role },
    config.jwt.secret as Secret,
    {
      expiresIn: config.jwt.access_expires_in,
    }
  );
  // create refresh token
  const refreshToken = jwtHelper.createToken(
    { _id: isAdminExist._id, role: isAdminExist.role },
    config.jwt.refresh_secret as Secret,
    {
      expiresIn: config.jwt.refresh_expires_in,
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};

const updateProfile = async (
  id: string,
  payload: Partial<IAdmin>
): Promise<IAdmin | null> => {
  const isExist = await Admin.findOne({ _id: id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found !');
  }

  const { name, ...userData } = payload;

  const updatedAdminData: Partial<IAdmin> = { ...userData };
  // dynamically handling

  if (userData.password) {
    updatedAdminData.password = await bcrypt.hash(
      userData.password,
      Number(config.bycrypt_salt_rounds)
    );
  }

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IAdmin>; // `name.fisrtName`
      (updatedAdminData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Admin.findOneAndUpdate({ _id: id }, updatedAdminData, {
    new: true,
  });
  return result;
};

const getSingleAdmin = async (id: string): Promise<IAdmin | null> => {
  const result = await Admin.findOne({ _id: id });
  return result;
};

export const AdminService = {
  createAdmin,
  adminLogin,
  updateProfile,
  getSingleAdmin,
};

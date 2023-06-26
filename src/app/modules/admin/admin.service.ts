import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { IAdmin, ILoginAdmin, ILoginAdminResponse } from './admin.interface';
import { Admin } from './admin.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelper } from '../../../helpers/jwtHelper';

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

const adminLogin = async (
  payload: ILoginAdmin
): Promise<ILoginAdminResponse> => {
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
    { phoneNumber: isAdminExist.phoneNumber, role: isAdminExist.role },
    config.jwt.secret as Secret,
    {
      expiresIn: config.jwt.access_expires_in,
    }
  );
  // create refresh token
  const refreshToken = jwtHelper.createToken(
    { phoneNumber: isAdminExist.phoneNumber, role: isAdminExist.role },
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

export const AdminService = {
  createAdmin,
  adminLogin,
};

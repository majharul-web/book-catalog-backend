import { Secret } from 'jsonwebtoken';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import config from '../../../config';
import { jwtHelper } from '../../../helpers/jwtHelper';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { ILogin, ILoginResponse } from '../../../interfaces/auth';

const signUp = async (user: IUser): Promise<Partial<IUser> | null> => {
  if (user) {
    user.role = 'user';
  }

  const result = await User.create(user);
  if (result) {
    // eslint-disable-next-line no-unused-vars
    const { password, ...dataWithoutPassword } = result.toJSON();
    return dataWithoutPassword;
  }
  return null;
};

const userLogin = async (payload: ILogin): Promise<ILoginResponse> => {
  const { email, password } = payload;

  // check User is exist
  const isUserExist = await User.isUserExistByEmail(email);

  // eslint-disable-next-line no-unused-vars
  // const { password: pp, ...dataWithoutPassword } = isUserExist.toJSON();

  console.log('user', isUserExist);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // check password is match
  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist?.password))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password not match');
  }

  const user = await User.findOne({ email: email });

  // create access token
  const accessToken = jwtHelper.createToken(
    { _id: isUserExist._id, role: isUserExist.role },
    config.jwt.secret as Secret,
    {
      expiresIn: config.jwt.access_expires_in,
    }
  );
  // create refresh token
  const refreshToken = jwtHelper.createToken(
    { _id: isUserExist._id, role: isUserExist.role },
    config.jwt.refresh_secret as Secret,
    {
      expiresIn: config.jwt.refresh_expires_in,
    }
  );
  return {
    accessToken,
    user: user,
    refreshToken,
  };
};

export const AuthService = {
  signUp,
  userLogin,
};

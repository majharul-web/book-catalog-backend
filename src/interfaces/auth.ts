import { IUser } from '../app/modules/user/user.interface';

export type ILogin = {
  email: string;
  password: string;
};

export type ILoginResponse = {
  accessToken: string;
  user: Partial<IUser | null>;
  refreshToken?: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

const signUp = async (user: IUser): Promise<IUser | null> => {
  const result = await User.create(user);
  return result;
};

export const AuthService = {
  signUp,
};

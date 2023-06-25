/* eslint-disable @typescript-eslint/no-explicit-any */

import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (user: IAdmin): Promise<IAdmin | null> => {
  const result = await Admin.create(user);
  return result;
};

export const AdminService = {
  createAdmin,
};

import { Model, Types } from 'mongoose';
import { IBook } from '../book/book.interface';
import { IUser } from '../user/user.interface';

export type IWishlist = {
  book: Types.ObjectId | IBook;
  user: Types.ObjectId | IUser;
};

export type WishlistModel = Model<IWishlist, Record<string, unknown>>;

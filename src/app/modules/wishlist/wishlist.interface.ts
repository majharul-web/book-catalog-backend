import { Model, Types } from 'mongoose';
import { IBook } from '../book/book.interface';

export type IWishlist = {
  book: Types.ObjectId | IBook;
};

export type WishlistModel = Model<IWishlist, Record<string, unknown>>;

export type IWishlistFilters = {
  searchTerm?: string;
  genre?: string;
  publicationYear?: string;
  title?: string;
  author?: string;
};

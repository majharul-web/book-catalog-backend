import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';
export type IBookReview = {
  rating: string;
  comment: string;
};

export type IBook = {
  title: string;
  author: string;
  genre: string;
  publicationDate: string;
  reviews: IBookReview[];
  createdBy: Types.ObjectId | IUser;
  image?: string;
  description?: string;
};

export type BookModel = Model<IBook, Record<string, unknown>>;

export type IBookFilters = {
  searchTerm?: string;
  genre?: string;
  publicationYear?: string;
  title?: string;
  author?: string;
};

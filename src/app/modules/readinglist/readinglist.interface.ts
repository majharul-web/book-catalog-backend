import { Model, Types } from 'mongoose';
import { IBook } from '../book/book.interface';

export type IReadinglist = {
  book: Types.ObjectId | IBook;
  status: string;
};

export type ReadinglistModel = Model<IReadinglist, Record<string, unknown>>;

export type IReadinglistFilters = {
  searchTerm?: string;
  genre?: string;
  publicationYear?: string;
  title?: string;
  author?: string;
};

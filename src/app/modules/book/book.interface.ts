import { Model } from 'mongoose';
export type IBookReview = {
  rating: string;
  comment: string;
};

export type IBook = {
  title: string;
  author: string;
  genre: string;
  publicationDate: Date;
  reviews: IBookReview[];
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

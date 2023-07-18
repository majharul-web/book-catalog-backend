import { Schema, model } from 'mongoose';
import { IBook, BookModel } from './book.interface';

const BookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    publicationDate: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId, // User --> _id
      ref: 'User',
      required: true,
    },
    reviews: {
      type: [{ rating: Number, comment: String }],
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
export const Book = model<IBook, BookModel>('Book', BookSchema);

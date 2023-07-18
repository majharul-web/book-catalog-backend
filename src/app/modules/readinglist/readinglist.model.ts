import { Schema, model } from 'mongoose';
import { IReadinglist, ReadinglistModel } from './readinglist.interface';
import { bookReadStatus } from './readinglist.constant';

const ReadinglistSchema = new Schema<IReadinglist>(
  {
    book: {
      type: Schema.Types.ObjectId, // Book --> _id
      ref: 'Book',
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId, // User --> _id
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: bookReadStatus,
      default: bookReadStatus[0],
    },
  },

  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Readinglist = model<IReadinglist, ReadinglistModel>(
  'Readinglist',
  ReadinglistSchema
);

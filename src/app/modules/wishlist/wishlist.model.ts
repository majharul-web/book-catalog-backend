import { Schema, model } from 'mongoose';
import { IWishlist, WishlistModel } from './wishlist.interface';

const WishlistSchema = new Schema<IWishlist>(
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
  },

  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Wishlist = model<IWishlist, WishlistModel>(
  'Wishlist',
  WishlistSchema
);

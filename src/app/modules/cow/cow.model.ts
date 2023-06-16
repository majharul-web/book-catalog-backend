import { Schema, model } from 'mongoose';
import { ICow, CowModel } from './cow.interface';
import { cowBreed, cowCategory, cowLabel, cowLocation } from './cow.constant';

const cowSchema = new Schema<ICow>(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      enum: cowLocation,
    },
    breed: {
      type: String,
      required: true,
      enum: cowBreed,
    },
    weight: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: 'for sale',
      enum: cowLabel,
    },
    category: {
      type: String,
      required: true,
      enum: cowCategory,
    },
    seller: {
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
export const Cow = model<ICow, CowModel>('Cow', cowSchema);

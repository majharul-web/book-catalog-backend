import { z } from 'zod';
import { cowBreed, cowCategory, cowLabel, cowLocation } from './cow.constant';

const createCowZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    age: z.string({
      required_error: 'Age number is required',
    }),

    price: z.string({
      required_error: 'Price is required',
    }),

    location: z.enum([...cowLocation] as [string, ...string[]], {
      required_error: 'Location is required',
    }),
    breed: z.enum([...cowBreed] as [string, ...string[]], {
      required_error: 'Location is required',
    }),
    weight: z.string({
      required_error: 'Weight is required',
    }),
    label: z.enum([...cowLabel] as [string, ...string[]]).optional(),
    category: z.enum([...cowCategory] as [string, ...string[]], {
      required_error: 'Category is required',
    }),
    seller: z.string({
      required_error: 'seller is required',
    }),
  }),
});

const updateCowZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    age: z.string().optional(),
    price: z.string().optional(),
    location: z.enum([...cowLocation] as [string, ...string[]]).optional(),
    breed: z.enum([...cowBreed] as [string, ...string[]]).optional(),
    weight: z.string().optional(),
    label: z.enum([...cowLabel] as [string, ...string[]]).optional(),
    category: z.enum([...cowCategory] as [string, ...string[]]).optional(),
    seller: z.string().optional(),
  }),
});

export const CowValidation = {
  createCowZodSchema,
  updateCowZodSchema,
};

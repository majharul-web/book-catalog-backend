import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    password: z
      .string({ required_error: 'Password is required' })
      .refine(value => value.length >= 8, {
        message: 'Password must be at least 8 characters long',
      }),
    name: z.string({ required_error: 'Name is required' }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email address' }),

    address: z.string({
      required_error: 'Address is required',
    }),
  }),
});

export const UserValidation = {
  createUserZodSchema,
};

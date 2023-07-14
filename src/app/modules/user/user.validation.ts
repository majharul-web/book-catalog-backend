import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    password: z
      .string({ required_error: 'Password is required' })
      .refine(value => value.length >= 8, {
        message: 'Password must be at least 8 characters long',
      }),
    name: z.object({
      firstName: z.string({
        required_error: 'First name is required',
      }),
      lastName: z.string({
        required_error: 'Last name is required',
      }),
    }),
    phoneNumber: z
      .string({
        required_error: 'Phone number is required',
      })
      .refine(value => /^(?:\+?88)?01[13-9]\d{8}$/.test(value), {
        message: 'Invalid Bangladeshi phone number',
      }),
    address: z.string({
      required_error: 'Address is required',
    }),
  }),
});

export const UserValidation = {
  createUserZodSchema,
};

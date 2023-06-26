import { z } from 'zod';

const userLoginZodSchema = z.object({
  body: z.object({
    password: z.string({ required_error: 'Password is required' }),
    phoneNumber: z
      .string({
        required_error: 'Phone number is required',
      })
      .refine(value => /^(?:\+?88)?01[13-9]\d{8}$/.test(value), {
        message: 'Invalid Bangladeshi phone number',
      }),
  }),
});

export const AuthValidation = {
  userLoginZodSchema,
};

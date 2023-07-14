import { z } from 'zod';

const userLoginZodSchema = z.object({
  body: z.object({
    password: z
      .string({ required_error: 'Password is required' })
      .refine(value => value.length >= 8, {
        message: 'Password must be at least 8 characters long',
      }),
    phoneNumber: z
      .string({
        required_error: 'Phone number is required',
      })
      .refine(value => /^(?:\+?88)?01[13-9]\d{8}$/.test(value), {
        message: 'Invalid Bangladeshi phone number',
      }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required',
    }),
  }),
});

export const AuthValidation = {
  userLoginZodSchema,
  refreshTokenZodSchema,
};

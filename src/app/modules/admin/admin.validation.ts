import { z } from 'zod';

const createAdminZodSchema = z.object({
  body: z.object({
    name: z.object({
      firstName: z.string({
        required_error: 'First name is required',
      }),
      lastName: z.string({ required_error: 'Last name is required' }),
    }),
    password: z.string({ required_error: 'Password is required' }),
    role: z.enum(['admin']),
    address: z.string({ required_error: 'Address is required' }),
    phoneNumber: z
      .string({
        required_error: 'Phone number is required',
      })
      .refine(value => /^(?:\+?88)?01[13-9]\d{8}$/.test(value), {
        message: 'Invalid Bangladeshi phone number',
      }),
  }),
});
const updateAdminZodSchema = z.object({
  body: z.object({
    name: z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    }),
    password: z.string().optional(),
    role: z.enum(['admin']).optional(),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
});

const adminLoginZodSchema = z.object({
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

export const AdminValidation = {
  updateAdminZodSchema,
  createAdminZodSchema,
  adminLoginZodSchema,
};

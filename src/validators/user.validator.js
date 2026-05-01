import { z } from 'zod';

export const registerSchema = z.object({
  name:     z.string().min(2).max(80).trim(),
  email:    z.string().email().toLowerCase(),
  password: z.string().min(8).max(100)
              .regex(/[A-Z]/, 'Must contain an uppercase letter')
              .regex(/[0-9]/, 'Must contain a number'),
});

export const loginSchema = z.object({
  email:    z.string().email().toLowerCase(),
  password: z.string().min(1),
});

export const updateUserSchema = z.object({
  name:      z.string().min(2).max(80).trim().optional(),
  email:     z.string().email().toLowerCase().optional(),
  role:      z.enum(['user', 'admin']).optional(),
  is_active: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field required',
});

export const changePasswordSchema = z.object({
  current_password: z.string().min(1),
  new_password:     z.string().min(8).max(100)
                      .regex(/[A-Z]/, 'Must contain an uppercase letter')
                      .regex(/[0-9]/, 'Must contain a number'),
});

export const paginationSchema = z.object({
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

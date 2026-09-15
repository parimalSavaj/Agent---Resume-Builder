import { z } from 'zod';

export const signupBodySchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(64, 'Username must be at most 64 characters')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Username may only contain letters, numbers, underscores, dots, and hyphens'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

export const loginBodySchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshBodySchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

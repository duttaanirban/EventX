import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['user', 'organizer']).default('user')
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({ email: z.string().email() })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(20),
    password: z.string().min(8)
  })
});

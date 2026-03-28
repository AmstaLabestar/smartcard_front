import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email ou numero requis'),
  password: z.string().min(8, 'Minimum 8 caracteres'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'Prenom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phoneNumber: z.string().optional().or(z.literal('')),
  password: z.string().min(8, 'Minimum 8 caracteres'),
  role: z.enum(['USER', 'MERCHANT']).default('USER'),
}).superRefine((data, ctx) => {
  if (!data.email && !data.phoneNumber) {
    ctx.addIssue({
      code: 'custom',
      message: 'Email ou numero requis',
      path: ['email'],
    });
  }
});

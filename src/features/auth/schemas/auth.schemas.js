import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Email ou numero requis'),
  password: z.string().min(8, 'Minimum 8 caracteres'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'Prenom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().trim().email('Email invalide').optional().or(z.literal('')),
  phoneNumber: z.string().trim().optional().or(z.literal('')),
  password: z.string().min(8, 'Minimum 8 caracteres'),
}).superRefine((data, ctx) => {
  if (!data.email && !data.phoneNumber) {
    ctx.addIssue({
      code: 'custom',
      message: 'Email ou numero requis',
      path: ['email'],
    });
  }
});

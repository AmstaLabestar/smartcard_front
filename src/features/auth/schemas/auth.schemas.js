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

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, 'Minimum 8 caracteres'),
  newPassword: z.string().min(8, 'Minimum 8 caracteres'),
  confirmPassword: z.string().min(8, 'Minimum 8 caracteres'),
}).superRefine((data, ctx) => {
  if (data.currentPassword === data.newPassword) {
    ctx.addIssue({
      code: 'custom',
      message: 'Le nouveau mot de passe doit etre different',
      path: ['newPassword'],
    });
  }

  if (data.newPassword !== data.confirmPassword) {
    ctx.addIssue({
      code: 'custom',
      message: 'Les mots de passe ne correspondent pas',
      path: ['confirmPassword'],
    });
  }
});

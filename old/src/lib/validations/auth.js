// src/lib/validations/auth.js
import { z } from 'zod';

// For translation, you'd typically pass the `t` function or keys
// This example uses direct keys that match your messages.json structure.

export const loginSchema = (t) => z.object({
    email: z
        .string()
        .min(1, t('forms.required'))
        .email(t('forms.emailInvalid')),
    password: z
        .string()
        .min(6, t('forms.passwordMin', { min: 6 })), // Example with variable
    rememberMe: z.boolean().optional(),
});

export const registerSchema = (t) => z.object({
    // Add other fields like name, etc. as needed by your backend
    email: z
        .string()
        .min(1, t('forms.required'))
        .email(t('forms.emailInvalid')),
    password: z
        .string()
        .min(6, t('forms.passwordMin', { min: 6 })),
    confirmPassword: z
        .string()
        .min(1, t('forms.required')),
}).refine((data) => data.password === data.confirmPassword, {
    message: t('forms.passwordMatch'),
    path: ['confirmPassword'], // Field to display the error under
});

export const profileSchema = (t) => z.object({
    firstName: z.string().min(1, t('forms.required')),
    lastName: z.string().min(1, t('forms.required')),
    email: z.string().min(1, t('forms.required')).email(t('forms.emailInvalid')),
    phone: z.string().optional().or(z.literal('')), // Allow empty string or make it truly optional
    // Add other profile fields as necessary
});
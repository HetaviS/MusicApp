import { z } from 'zod';

export const SigninSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email('Please enter a valid email address'),

    login_type: z.enum(['email', 'social'], {
        required_error: 'Login type is required',
        invalid_type_error: 'Login type must be either "email" or "social"',
    }),
});

export const verifyOtpSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email('Please enter a valid email address'),
    otp: z
        .string({ required_error: 'OTP is required' })
});

export const resendOtpSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email('Please enter a valid email address'),
});

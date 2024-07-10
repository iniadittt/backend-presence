import { z } from 'zod';

const indonesianPhoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{6,11}$/;

export const loginSchema = z.object({
    email: z.string().email().max(100),
    password: z.string().min(8, 'Password must contain at least 8 character(s)'),
});

export const registerSchema = z.object({
    email: z.string().email().min(8).max(100),
    password: z.string().min(8),
    name: z.string().min(6).max(100),
    phone: z.string().min(10).max(20).regex(indonesianPhoneRegex, {
        message: "Phone number must be a valid Indonesian number"
    })
})

export const verifySchema = z.object({
    email: z.string().email().min(8).max(100),
    otp: z.string().min(6).max(6),
})

export const getTokenSchema = z.object({
    email: z.string().email().min(8).max(100),
})

export const updateProfileSchema = z.object({
    name: z.string().min(6).max(100).optional(),
    phone: z.string().min(10).max(20).regex(indonesianPhoneRegex, {
        message: "Phone number must be a valid Indonesian number"
    }).optional()
})

export const updatePasswordSchema = z.object({
    passwordLama: z.string().min(8),
    passwordBaru: z.string().min(8),
    konfirmasiPasswordBaru: z.string().min(8),
})

export const addUserSchema = z.object({
    email: z.string().email().min(8).max(100),
    name: z.string().min(6).max(100),
    password: z.string().min(8),
    phone: z.string().min(10).max(20).regex(indonesianPhoneRegex, {
        message: "Phone number must be a valid Indonesian number"
    }),
    role: z.enum(['admin', 'user'])
})

export const updateUserSchema = z.object({
    email: z.string().email().min(8).max(100).optional(),
    name: z.string().min(6).max(100).optional(),
    phone: z.string().min(10).max(20).regex(indonesianPhoneRegex, {
        message: "Phone number must be a valid Indonesian number"
    }).optional(),
    role: z.enum(['admin', 'user']).optional()
})


export const updatePasswordUserSchema = z.object({
    password: z.string().min(8),
    konfirmasiPassword: z.string().min(8),
})

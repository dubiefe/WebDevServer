// src/schemas/user.schema.js
import z from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.email().transform((val) => val.toUpperCase()),
    password: z.string().min(8),
    name: z.string(),
    lastname: z.string(),
    nif: z.string(),
    address: z.object({
      street: z.string(),
      number: z.string(),
      postal: z.string(),
      city: z.string(),
      province: z.string()
    }),
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email().transform((val) => val.toUpperCase()),
    password: z.string().min(8)
  })
});

export const emailValidationSchema = z.object({
  body: z.object({
    verificationCode: z.string().min(6).max(6)
  })
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    lastname: z.string().optional(),
    nif: z.string().optional(),
  })
});
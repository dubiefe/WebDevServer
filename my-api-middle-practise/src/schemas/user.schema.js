// src/schemas/user.schema.js
import z from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.email().transform((val) => val.toUpperCase()),
    password: z.string().min(8),
    name: z.string(),
    lastname: z.string(),
    nif: z.string()
  })
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().min(2).optional(),
  })
});
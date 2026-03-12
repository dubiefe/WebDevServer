// src/schemas/books.schema.js
import z from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().min(2),
  })
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().min(2).optional(),
  })
});
// src/schemas/books.schema.js
import { z } from 'zod';

export const createBookSchema = z.object({
  body: z.object({
    id: z.int(),
    title: z.string(),
    author: z.string(),
    year: z.int().min(0).max(new Date().getFullYear()),
    pages: z.int().min(2)
  })
});

export const updateBookSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    year: z.int().min(0).max(new Date().getFullYear()).optional(),
    pages: z.int().min(2).optional()
  })
});
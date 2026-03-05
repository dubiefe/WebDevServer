// src/schemas/books.schema.js
import { optional, z } from 'zod';

export const createMovieSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    director: z.string(),
    year: z.number().min(1888).max(new Date().getFullYear()).optional(),
    genre: z.enum(['action','comedy','drama','horror','scifi']).optional(),
    copies: z.number().optional(),
    availableCopies: z.number().optional(),
    timesRented: z.number().optional(),
    cover: z.string().optional()
  })
});

export const updateMovieSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    director: z.string().optional(),
    year: z.number().min(1888).max(new Date().getFullYear()).optional(),
    genre: z.enum(['action','comedy','drama','horror','scifi']).optional(),
    copies: z.number().optional(),
    availableCopies: z.number().optional(),
    timesRented: z.number().optional(),
    cover: z.string().optional()
  })
});
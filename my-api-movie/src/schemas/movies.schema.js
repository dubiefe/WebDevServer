// src/schemas/books.schema.js
import { z } from 'zod';

export const createMovieSchema = z.object({
  body: z.object({
    id: z.int()
  })
});

export const updateMovieSchema = z.object({
  body: z.object({

  })
});
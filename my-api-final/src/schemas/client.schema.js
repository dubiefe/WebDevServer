// src/schemas/client.schema.js
import z from 'zod';

export const createClientSchema = z.object({
  body: z.object({
    name: z.string(),
    cif: z.string(),
    email: z.email().transform((val) => val.toUpperCase()),
    address: z.object({
      street: z.string(),
      number: z.string(),
      postal: z.string(),
      city: z.string(),
      province: z.string()
    })
  })
});
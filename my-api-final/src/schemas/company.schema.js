// src/schemas/user.schema.js
import z from 'zod';

export const createCompanySchema = z.object({
  body: z.object({
    name: z.string(),
    cif: z.string(),
    address: z.object({
      street: z.string(),
      number: z.string(),
      postal: z.string(),
      city: z.string(),
      province: z.string()
    }),
    isFreelance: z.boolean()
  })
});
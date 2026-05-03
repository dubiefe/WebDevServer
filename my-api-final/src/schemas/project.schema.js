// src/schemas/project.schema.js
import z from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    clientId: z.string(),
    name: z.string(),
    projectCode: z.string(),
    address: z.object({
      street: z.string(),
      number: z.string(),
      postal: z.string(),
      city: z.string(),
      province: z.string()
    }),
    email: z.email().transform((val) => val.toUpperCase()),
    notes: z.string().optional(),
    active: z.boolean()
  })
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    notes: z.string().optional(),
    active: z.boolean().optional()
  })
});
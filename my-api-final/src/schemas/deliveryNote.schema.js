// src/schemas/deliveryNote.schema.js
import z from 'zod';

const workerSchema = z.object({
  name: z.string(),
  hours: z.number(),
});

export const createDeliveryNoteSchema = z.object({
  body: z.discriminatedUnion("format", [
    z.object({
      format: z.literal("material"),
      project: z.string(),
      description: z.string(),
      workDate: z.coerce.date(),
      material: z.string(),
      quantity: z.coerce.number(),
      unit: z.string(),
      workers: z.array(workerSchema).optional(),
    }),
    z.object({
      format: z.literal("hours"),
      project: z.string(),
      description: z.string(),
      workDate: z.coerce.date(),
      hours: z.coerce.number(),
      workers: z.array(workerSchema).optional(),
    }),
  ]),
});

export const signDeliveryNoteSchema = z.object({
  body: z.object({
    signature: z.string()
  }),
});
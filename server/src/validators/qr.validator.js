import { z } from 'zod';

export const qrValidateSchema = z.object({
  body: z.object({
    payload: z.union([
      z.string().min(10),
      z.object({
        bookingId: z.string().min(12),
        eventId: z.string().min(12),
        token: z.string().min(32)
      })
    ])
  })
});

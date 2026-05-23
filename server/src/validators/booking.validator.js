import { z } from 'zod';

export const bookingIntentSchema = z.object({
  body: z.object({
    eventId: z.string().min(12),
    ticketCount: z.coerce.number().int().min(1).max(10)
  })
});

import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    eventId: z.string().min(12),
    ticketCount: z.coerce.number().int().min(1).max(10)
  })
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string()
  })
});

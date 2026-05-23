import { z } from 'zod';

export const eventWriteSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(120),
    description: z.string().min(20),
    bannerImage: z.string().url(),
    venue: z.string().min(2),
    city: z.string().min(2),
    date: z.coerce.date(),
    time: z.string().min(3),
    category: z.string().min(2),
    ticketPrice: z.coerce.number().min(0),
    totalSeats: z.coerce.number().int().min(1)
  })
});

export const eventQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    city: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    sort: z.enum(['date', 'price', '-price', 'createdAt']).default('date'),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12)
  })
});

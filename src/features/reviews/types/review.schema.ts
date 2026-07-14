import { z } from 'zod';

/* ── Entities (contract parity) ── */

const reviewUserSchema = z.object({
  firstName: z.string(),
  avatarUrl: z.string().nullable(),
});

const reviewSchema = z.object({
  id: z.string(),
  userId: z.string(),
  serviceId: z.string(),
  bookingId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string(),
  createdAt: z.string(),
  user: reviewUserSchema,
});

/* ── Server request validation (mock handlers) ── */

const createReviewRequestSchema = z.object({
  bookingId: z.string().uuid(),
  serviceId: z.string().uuid(),
  rating: z.number().int().min(1, 'Rating must be between 1 and 5.').max(5, 'Rating must be between 1 and 5.'),
  comment: z
    .string()
    .trim()
    .min(10, 'Comment must be at least 10 characters.')
    .max(500, 'Comment must be under 500 characters.'),
});

/* ── Client form validation (RHF) ── */

const writeReviewFormSchema = z.object({
  serviceId: z.string().min(1, 'Select the service you want to review.'),
  rating: z.number().int().min(1, 'Select a star rating.').max(5),
  comment: z
    .string()
    .trim()
    .min(10, 'Please share at least 10 characters.')
    .max(500, 'Please keep your review under 500 characters.'),
});

export { createReviewRequestSchema, reviewSchema, reviewUserSchema, writeReviewFormSchema };

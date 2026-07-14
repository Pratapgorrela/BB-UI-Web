import { z } from 'zod';

/* ── Enums ── */

const supportIssueTypeSchema = z.enum([
  'BOOKING_ISSUE',
  'PAYMENT_ISSUE',
  'SERVICE_QUALITY',
  'APP_ISSUE',
  'OTHER',
]);

const supportRequestStatusSchema = z.enum(['OPEN', 'IN_REVIEW', 'RESOLVED', 'CLOSED']);

/* ── Entities (contract parity) ── */

const faqSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  sortOrder: z.number().int(),
});

const supportRequestSchema = z.object({
  id: z.string(),
  userId: z.string(),
  referenceCode: z.string(),
  bookingId: z.string().nullable(),
  bookingReferenceCode: z.string().nullable(),
  issueType: supportIssueTypeSchema,
  description: z.string(),
  status: supportRequestStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

/* ── Server request validation (mock handlers) ── */

const createSupportRequestRequestSchema = z.object({
  bookingId: z.string().uuid().nullable().optional(),
  issueType: supportIssueTypeSchema,
  description: z.string().min(1, 'Description is required.'),
});

/* ── Client form validation (RHF) — stricter than the server minimum ── */

/** Sentinel option value for "Not related to a booking" in the form's dropdown. */
const NO_BOOKING_VALUE = 'NONE';

const raiseConcernFormSchema = z.object({
  bookingId: z.string().min(1, 'Select a booking or "Not related to a booking".'),
  issueType: supportIssueTypeSchema.or(z.literal('')).refine((value) => value !== '', {
    message: 'Select an issue type.',
  }),
  description: z
    .string()
    .trim()
    .min(20, 'Please describe the issue in at least 20 characters.')
    .max(1000, 'Please keep the description under 1000 characters.'),
});

export {
  createSupportRequestRequestSchema,
  faqSchema,
  NO_BOOKING_VALUE,
  raiseConcernFormSchema,
  supportIssueTypeSchema,
  supportRequestSchema,
  supportRequestStatusSchema,
};

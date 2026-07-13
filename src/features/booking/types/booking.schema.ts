import { z } from 'zod';
import {
  cartItemSchema,
  checkoutSummaryRequestSchema,
  paymentSummarySchema,
} from '../../cart/types/cart.schema';

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');
const hhmmSchema = z.string().regex(/^\d{2}:\d{2}$/, 'Expected HH:mm');

const timeSlotSchema = z.object({
  id: z.uuid(),
  date: isoDateSchema,
  startTime: hhmmSchema,
  endTime: hhmmSchema,
  isAvailable: z.boolean(),
});

const bookingStatusSchema = z.enum([
  'PENDING',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

const specialistSchema = z.object({
  id: z.uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  avatarUrl: z.string(),
  bio: z.string(),
  specialties: z.array(z.string().min(1)),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  yearsOfExperience: z.number().int().nonnegative(),
  serviceIds: z.array(z.uuid()),
});

const bookingSchema = z.object({
  id: z.uuid(),
  userId: z.string().min(1),
  referenceCode: z.string().regex(/^BB-\d{8}-[A-Z0-9]{4}$/),
  items: z.array(cartItemSchema).min(1),
  paymentSummary: paymentSummarySchema,
  addressId: z.uuid(),
  specialistId: z.uuid(),
  status: bookingStatusSchema,
  scheduledAt: z.iso.datetime(),
  duration: z.number().int().positive(),
  notes: z.string().nullable(),
  cancellationReason: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

const bookingAddressSchema = z.object({
  id: z.uuid(),
  label: z.string().min(1),
  line: z.string().min(1),
});

const bookingDetailSchema = bookingSchema.extend({
  specialist: specialistSchema,
  address: bookingAddressSchema,
});

/* ── Request schemas (validate handler bodies / query params) ── */

const timeSlotsQuerySchema = z.object({
  date: isoDateSchema,
});

const createBookingRequestSchema = checkoutSummaryRequestSchema.extend({
  addressId: z.uuid(),
  timeSlotId: z.uuid(),
  notes: z.string().max(500).nullable().optional(),
});

const bookingsListQuerySchema = z.object({
  status: z
    .string()
    .transform((value) => value.split(','))
    .pipe(z.array(bookingStatusSchema))
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

const rescheduleBookingRequestSchema = z.object({
  timeSlotId: z.uuid(),
});

const cancelBookingRequestSchema = z.object({
  cancellationReason: z.string().trim().min(1).max(500),
});

/** Client-side cancel form — stricter than the API so users give a real reason. */
const cancelBookingFormSchema = z.object({
  cancellationReason: z
    .string()
    .trim()
    .min(5, 'Please tell us why (at least 5 characters).')
    .max(500, 'Please keep it under 500 characters.'),
});

export {
  bookingAddressSchema,
  bookingDetailSchema,
  bookingSchema,
  bookingsListQuerySchema,
  bookingStatusSchema,
  cancelBookingFormSchema,
  cancelBookingRequestSchema,
  createBookingRequestSchema,
  isoDateSchema,
  rescheduleBookingRequestSchema,
  specialistSchema,
  timeSlotSchema,
  timeSlotsQuerySchema,
};

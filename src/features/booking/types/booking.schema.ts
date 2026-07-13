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

/* ── Request schemas (validate handler bodies / query params) ── */

const timeSlotsQuerySchema = z.object({
  date: isoDateSchema,
});

const createBookingRequestSchema = checkoutSummaryRequestSchema.extend({
  addressId: z.uuid(),
  timeSlotId: z.uuid(),
  notes: z.string().max(500).nullable().optional(),
});

export {
  bookingSchema,
  bookingStatusSchema,
  createBookingRequestSchema,
  isoDateSchema,
  specialistSchema,
  timeSlotSchema,
  timeSlotsQuerySchema,
};

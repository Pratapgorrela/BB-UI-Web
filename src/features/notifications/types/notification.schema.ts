import { z } from 'zod';

/* ── Enums ── */

const notificationTypeSchema = z.enum([
  'BOOKING_CONFIRMED',
  'BOOKING_REMINDER',
  'BOOKING_CANCELLED',
  'REVIEW_REQUEST',
  'PROMO',
]);

const notificationCategorySchema = z.enum(['BOOKING', 'OFFER']);

/* ── Entities (contract parity) ── */

const notificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: notificationTypeSchema,
  title: z.string(),
  message: z.string(),
  isRead: z.boolean(),
  referenceId: z.string().nullable(),
  referenceType: z.string().nullable(),
  createdAt: z.string(),
});

const notificationSettingsSchema = z.object({
  userId: z.string(),
  whatsappEnabled: z.boolean(),
  bookingUpdates: z.boolean(),
  servicePromotions: z.boolean(),
  referralRewards: z.boolean(),
  feedbackRequests: z.boolean(),
  updatedAt: z.string(),
});

/* ── Server request validation (mock handlers) ── */

const updateNotificationSettingsRequestSchema = z
  .object({
    whatsappEnabled: z.boolean(),
    bookingUpdates: z.boolean(),
    servicePromotions: z.boolean(),
    referralRewards: z.boolean(),
    feedbackRequests: z.boolean(),
  })
  .partial();

export {
  notificationCategorySchema,
  notificationSchema,
  notificationSettingsSchema,
  notificationTypeSchema,
  updateNotificationSettingsRequestSchema,
};

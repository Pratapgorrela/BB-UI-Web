import type {
  Notification,
  NotificationSettings,
} from '../../features/notifications/types/notification';

const PRIYA_USER_ID = '3f1c2a9e-8b4d-4c6a-9e2f-1a5b7c3d9e0f';
const RAHUL_USER_ID = '7d4e5f2b-1c8a-4b3d-8f6e-2c9a0b1d4e7f';

/** UUID-v4-shaped stable notification id from an index. */
function notifId(n: number): string {
  return `bbf10000-0000-4000-8000-${String(n).padStart(12, '0')}`;
}

/** A real seed booking id (mirrors `seedBookingId` in bookings.data.ts). */
function bookingRef(n: number): string {
  return `bb8f0000-0000-4000-8000-${String(n).padStart(12, '0')}`;
}

/** ISO timestamp `hours` hours before now — deterministic-enough for a demo feed. */
function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

/**
 * Read-only seed feed. Merged at read time with localStorage (`bb-mock-notifications`)
 * and a tombstone set — mutations overlay without mutating this module (mirrors
 * addresses/bookings). Priya has a mix across all 5 types and both read states so all
 * three tabs (All / Bookings / Offers) populate; Rahul has one (per-user scoping proof).
 */
const seedNotifications: Notification[] = [
  {
    id: notifId(1),
    userId: PRIYA_USER_ID,
    type: 'BOOKING_CONFIRMED',
    title: 'Booking confirmed',
    message: 'Your appointment is confirmed. Our specialist will arrive at your doorstep.',
    isRead: false,
    referenceId: bookingRef(1),
    referenceType: 'BOOKING',
    createdAt: hoursAgo(2),
  },
  {
    id: notifId(2),
    userId: PRIYA_USER_ID,
    type: 'BOOKING_REMINDER',
    title: 'Appointment reminder',
    message: 'Your service is coming up soon. Please keep your space ready.',
    isRead: false,
    referenceId: bookingRef(2),
    referenceType: 'BOOKING',
    createdAt: hoursAgo(6),
  },
  {
    id: notifId(3),
    userId: PRIYA_USER_ID,
    type: 'PROMO',
    title: 'Monsoon glow-up — 25% off',
    message: 'Refresh your look this season. Limited-time offer on select combos.',
    isRead: false,
    referenceId: null,
    referenceType: null,
    createdAt: hoursAgo(20),
  },
  {
    id: notifId(4),
    userId: PRIYA_USER_ID,
    type: 'REVIEW_REQUEST',
    title: 'How was your service?',
    message: 'Tell us about your recent appointment. Your feedback helps us improve.',
    isRead: false,
    referenceId: bookingRef(4),
    referenceType: 'BOOKING',
    createdAt: hoursAgo(28),
  },
  {
    id: notifId(5),
    userId: PRIYA_USER_ID,
    type: 'BOOKING_CANCELLED',
    title: 'Booking cancelled',
    message: 'Your booking has been cancelled. Any charges will be refunded shortly.',
    isRead: true,
    referenceId: bookingRef(6),
    referenceType: 'BOOKING',
    createdAt: hoursAgo(50),
  },
  {
    id: notifId(6),
    userId: PRIYA_USER_ID,
    type: 'PROMO',
    title: 'Refer a friend, get ₹100',
    message: 'Share the beauty and earn rewards when your friends book their first service.',
    isRead: true,
    referenceId: null,
    referenceType: null,
    createdAt: hoursAgo(72),
  },
  {
    id: notifId(7),
    userId: PRIYA_USER_ID,
    type: 'BOOKING_CONFIRMED',
    title: 'Booking confirmed',
    message: 'Your earlier appointment was confirmed. Thanks for choosing Beauty Bus.',
    isRead: true,
    referenceId: null,
    referenceType: null,
    createdAt: hoursAgo(120),
  },
  {
    id: notifId(8),
    userId: PRIYA_USER_ID,
    type: 'PROMO',
    title: 'Weekend self-care',
    message: 'Book a relaxing session this weekend and treat yourself.',
    isRead: true,
    referenceId: null,
    referenceType: null,
    createdAt: hoursAgo(168),
  },
  {
    id: notifId(9),
    userId: RAHUL_USER_ID,
    type: 'PROMO',
    title: 'Grooming essentials — flat ₹150 off',
    message: 'Sharpen up with our men’s grooming combos. Offer ends soon.',
    isRead: false,
    referenceId: null,
    referenceType: null,
    createdAt: hoursAgo(12),
  },
];

/** Defaults when a user has never saved: WhatsApp opt-in off, the 4 channels on. */
function defaultNotificationSettings(userId: string): NotificationSettings {
  return {
    userId,
    whatsappEnabled: false,
    bookingUpdates: true,
    servicePromotions: true,
    referralRewards: true,
    feedbackRequests: true,
    updatedAt: '2026-01-15T09:30:00.000Z',
  };
}

export { defaultNotificationSettings, seedNotifications };

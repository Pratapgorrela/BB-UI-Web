import { seedBookings } from './bookings.data';
import type { SupportRequest } from '../../features/support/types/support';

const PRIYA_USER_ID = '3f1c2a9e-8b4d-4c6a-9e2f-1a5b7c3d9e0f';
const RAHUL_USER_ID = '7d4e5f2b-1c8a-4b3d-8f6e-2c9a0b1d4e7f';

/** UUID-v4-shaped stable support-request id from an index. */
function requestId(n: number): string {
  return `bb5e0000-0000-4000-8000-${String(n).padStart(12, '0')}`;
}

/** ISO timestamp `days` days before now — deterministic-enough for a demo list. */
function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

/** Priya's COMPLETED seed booking — the resolved concern below references it. */
const completedBooking = seedBookings.find(
  (booking) => booking.userId === PRIYA_USER_ID && booking.status === 'COMPLETED',
);

/**
 * Read-only seed requests. Merged at read time with localStorage
 * (`bb-mock-support-requests`) — creations overlay without mutating this module
 * (mirrors bookings/addresses/notifications). Priya has one resolved
 * booking-linked concern + one open general concern so the list shows both
 * shapes; Rahul has one (per-user scoping proof).
 */
const seedSupportRequests: SupportRequest[] = [
  {
    id: requestId(1),
    userId: PRIYA_USER_ID,
    referenceCode: 'SR-20260705-C4Q7',
    bookingId: completedBooking?.id ?? null,
    bookingReferenceCode: completedBooking?.referenceCode ?? null,
    issueType: 'SERVICE_QUALITY',
    description:
      'The stylist did a great job overall, but the session ran almost an hour over the estimated duration and I had to reschedule my evening. Please look into the time estimates for combo services.',
    status: 'RESOLVED',
    createdAt: daysAgo(9),
    updatedAt: daysAgo(7),
  },
  {
    id: requestId(2),
    userId: PRIYA_USER_ID,
    referenceCode: 'SR-20260712-K9M2',
    bookingId: null,
    bookingReferenceCode: null,
    issueType: 'APP_ISSUE',
    description:
      'The offers carousel on the home screen sometimes shows an expired promotion. Tapping it does nothing. Seen on Android Chrome after the last update.',
    status: 'OPEN',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: requestId(3),
    userId: RAHUL_USER_ID,
    referenceCode: 'SR-20260711-T3B8',
    bookingId: null,
    bookingReferenceCode: null,
    issueType: 'PAYMENT_ISSUE',
    description:
      'I was charged twice for my last booking. The duplicate charge shows as pending on my card statement. Please reverse it.',
    status: 'IN_REVIEW',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
  },
];

export { seedSupportRequests };

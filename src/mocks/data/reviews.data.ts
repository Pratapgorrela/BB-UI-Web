import { seedBookings } from './bookings.data';
import type { Review } from '../../features/reviews/types/review';

const PRIYA_USER_ID = '3f1c2a9e-8b4d-4c6a-9e2f-1a5b7c3d9e0f';

/** UUID-v4-shaped stable review id from an index. */
function reviewId(n: number): string {
  return `bb9e0000-0000-4000-8000-${String(n).padStart(12, '0')}`;
}

/** Stable service id — mirrors `sid` in services.data.ts. */
function sid(n: number): string {
  return `bb5e0000-0000-4000-8000-${String(n).padStart(12, '0')}`;
}

/** ISO timestamp `days` days before now — deterministic-enough for a demo list. */
function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

/**
 * Priya's first COMPLETED seed booking (single service, sid(5)) — the seed
 * review below is attached to it via runtime lookup so ids always match.
 * Her second COMPLETED booking (multi-service) is deliberately left
 * un-reviewed so the write-a-review happy path stays demoable, while this
 * one demos the 409 CONFLICT duplicate path.
 */
const priyaCompletedBooking = seedBookings.find(
  (booking) => booking.userId === PRIYA_USER_ID && booking.status === 'COMPLETED',
);

/**
 * Read-only seed reviews. Merged at read time with localStorage
 * (`bb-mock-reviews`) — creations overlay without mutating this module
 * (mirrors bookings/addresses/notifications/support). Reviews from other
 * customers carry fabricated user/booking ids and embedded display authors —
 * the contract expands `user` on every list item, so seeds embed it directly
 * (same approach as testimonials imagery).
 */
const seedReviews: Review[] = [
  {
    id: reviewId(1),
    userId: PRIYA_USER_ID,
    serviceId: priyaCompletedBooking?.items[0]?.serviceId ?? sid(5),
    bookingId: priyaCompletedBooking?.id ?? reviewId(901),
    rating: 5,
    comment:
      'The specialist was punctual, professional and so thorough. My skin has never felt this good after a facial — and all without leaving home!',
    createdAt: daysAgo(2),
    user: { firstName: 'Priya', avatarUrl: null },
  },
  {
    id: reviewId(2),
    userId: 'c1a2b3d4-0001-4000-8000-000000000001',
    serviceId: sid(5),
    bookingId: 'c1a2b3d4-0002-4000-8000-000000000001',
    rating: 4,
    comment:
      'Really relaxing session and the van setup is surprisingly well equipped. Docking one star because the arrival was at the very end of the window.',
    createdAt: daysAgo(6),
    user: { firstName: 'Meera', avatarUrl: 'https://picsum.photos/seed/bb-rev-meera/96/96' },
  },
  {
    id: reviewId(3),
    userId: 'c1a2b3d4-0001-4000-8000-000000000002',
    serviceId: sid(5),
    bookingId: 'c1a2b3d4-0002-4000-8000-000000000002',
    rating: 5,
    comment:
      'Booked this for my mother who finds salon visits exhausting. The team was patient, gentle and kept everything spotless. Highly recommended.',
    createdAt: daysAgo(15),
    user: { firstName: 'Ananya', avatarUrl: null },
  },
  {
    id: reviewId(4),
    userId: 'c1a2b3d4-0001-4000-8000-000000000003',
    serviceId: sid(1),
    bookingId: 'c1a2b3d4-0002-4000-8000-000000000003',
    rating: 5,
    comment:
      'The combo is genuinely good value — every service in the bundle got proper time and attention. Booking again before the wedding season.',
    createdAt: daysAgo(4),
    user: { firstName: 'Kavya', avatarUrl: 'https://picsum.photos/seed/bb-rev-kavya/96/96' },
  },
  {
    id: reviewId(5),
    userId: 'c1a2b3d4-0001-4000-8000-000000000004',
    serviceId: sid(1),
    bookingId: 'c1a2b3d4-0002-4000-8000-000000000004',
    rating: 3,
    comment:
      'Good service overall but the products used felt different from what was described on the app. Would appreciate more transparency there.',
    createdAt: daysAgo(20),
    user: { firstName: 'Vikram', avatarUrl: null },
  },
  {
    id: reviewId(6),
    userId: 'c1a2b3d4-0001-4000-8000-000000000005',
    serviceId: sid(2),
    bookingId: 'c1a2b3d4-0002-4000-8000-000000000005',
    rating: 4,
    comment:
      'Second time booking this and the consistency is impressive. The stylist remembered my preferences from the notes. Small wait for the van.',
    createdAt: daysAgo(8),
    user: { firstName: 'Deepika', avatarUrl: 'https://picsum.photos/seed/bb-rev-deepika/96/96' },
  },
  {
    id: reviewId(7),
    userId: 'c1a2b3d4-0001-4000-8000-000000000006',
    serviceId: sid(3),
    bookingId: 'c1a2b3d4-0002-4000-8000-000000000006',
    rating: 5,
    comment:
      'Exactly what I needed before a big event. On time, hygienic, and the result lasted longer than my usual salon visit. Five stars.',
    createdAt: daysAgo(11),
    user: { firstName: 'Sneha', avatarUrl: null },
  },
  {
    id: reviewId(8),
    userId: 'c1a2b3d4-0001-4000-8000-000000000007',
    serviceId: sid(9),
    bookingId: 'c1a2b3d4-0002-4000-8000-000000000007',
    rating: 4,
    comment:
      'Great experience for my son who hates waiting at salons. The specialist was friendly and quick. The kit looked brand new and sealed.',
    createdAt: daysAgo(13),
    user: { firstName: 'Rohit', avatarUrl: null },
  },
  {
    id: reviewId(9),
    userId: 'c1a2b3d4-0001-4000-8000-000000000008',
    serviceId: sid(3),
    bookingId: 'c1a2b3d4-0002-4000-8000-000000000008',
    rating: 2,
    comment:
      'The service itself was fine but rescheduling twice on the same day soured the experience. Support did resolve it, hence the extra star.',
    createdAt: daysAgo(30),
    user: { firstName: 'Arjun', avatarUrl: null },
  },
  {
    id: reviewId(10),
    userId: 'c1a2b3d4-0001-4000-8000-000000000009',
    serviceId: sid(2),
    bookingId: 'c1a2b3d4-0002-4000-8000-000000000009',
    rating: 5,
    comment:
      'Beauty Bus has become my monthly ritual. The booking flow is easy, the staff are lovely, and I never have to fight for parking again.',
    createdAt: daysAgo(25),
    user: { firstName: 'Lakshmi', avatarUrl: 'https://picsum.photos/seed/bb-rev-lakshmi/96/96' },
  },
];

export { seedReviews };

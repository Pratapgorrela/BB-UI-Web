import { fail, ok, paginated, registerMock } from '../lib/mockEngine';
import { requireAuth } from '../lib/guards';
import { toValidationDetails } from './cart.mock';
import { allBookings } from './booking.mock';
import { findUserById } from './auth.mock';
import { seedReviews } from '../data/reviews.data';
import { seedServices } from '../data/services.data';
import { createReviewRequestSchema } from '../../features/reviews/types/review.schema';
import type { Review } from '../../features/reviews/types/review';

const REVIEWS_KEY = 'bb-mock-reviews';

/* ── Guarded persistence (Vitest runs in node; private mode can throw) ── */

function readStored(): Review[] {
  try {
    const raw = globalThis.localStorage?.getItem(REVIEWS_KEY);
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

function persistReview(review: Review): void {
  try {
    globalThis.localStorage?.setItem(REVIEWS_KEY, JSON.stringify([...readStored(), review]));
  } catch {
    /* storage unavailable — the created review just won't survive reload */
  }
}

/* ── Review universe (seed ∪ stored — creations only, no tombstones needed) ── */

function allReviews(): Review[] {
  const byId = new Map<string, Review>();
  for (const review of seedReviews) byId.set(review.id, review);
  for (const review of readStored()) byId.set(review.id, review);
  return [...byId.values()];
}

/** A service's reviews, newest first (contract: createdAt DESC). */
function reviewsForService(serviceId: string): Review[] {
  return allReviews()
    .filter((review) => review.serviceId === serviceId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* ── GET /services/:id/reviews (guest) ── */

registerMock('GET', '/services/:id/reviews', (req) => {
  const serviceId = req.params.id;
  const path = `/api/v1/services/${serviceId}/reviews`;

  const scenario = req.query.get('scenario');
  if (scenario === 'error') {
    return fail(500, 'INTERNAL_ERROR', 'Simulated server error. Please try again later.', path);
  }

  if (!seedServices.some((service) => service.id === serviceId)) {
    return fail(404, 'RESOURCE_NOT_FOUND', 'Service not found.', path);
  }

  const page = Math.max(1, Number(req.query.get('page')) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.get('limit')) || 10));

  const items = scenario === 'empty' ? [] : reviewsForService(serviceId);
  return paginated(items, page, limit);
});

/* ── POST /reviews ── */

registerMock('POST', '/reviews', (req) => {
  const path = '/api/v1/reviews';
  const userId = requireAuth(req, path);

  const parsed = createReviewRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(
      400,
      'VALIDATION_ERROR',
      'Request validation failed.',
      path,
      toValidationDetails(parsed.error.issues),
    );
  }

  const { bookingId, serviceId, rating, comment } = parsed.data;

  // Contract convention: FORCE_500 in the free-text field simulates a server
  // failure (mirrors the support-request convention).
  if (comment.includes('FORCE_500')) {
    return fail(500, 'INTERNAL_ERROR', 'Simulated server error. Please try again later.', path);
  }

  // Owned-or-unknown: another user's booking is indistinguishable from an
  // unknown one (contract: mirrors owned-or-404).
  const booking = allBookings().find((candidate) => candidate.id === bookingId);
  if (!booking || booking.userId !== userId) {
    return fail(400, 'VALIDATION_ERROR', 'Request validation failed.', path, [
      { field: 'bookingId', message: 'Unknown booking.' },
    ]);
  }

  if (!booking.items.some((item) => item.serviceId === serviceId)) {
    return fail(400, 'VALIDATION_ERROR', 'Request validation failed.', path, [
      { field: 'serviceId', message: 'Service is not part of this booking.' },
    ]);
  }

  if (booking.status !== 'COMPLETED') {
    return fail(
      422,
      'BUSINESS_RULE_VIOLATION',
      'Only completed bookings can be reviewed.',
      path,
    );
  }

  if (allReviews().some((review) => review.bookingId === bookingId)) {
    return fail(409, 'CONFLICT', 'A review already exists for this booking.', path);
  }

  const author = findUserById(userId);
  const review: Review = {
    id: crypto.randomUUID(),
    userId,
    serviceId,
    bookingId,
    rating,
    comment,
    createdAt: new Date().toISOString(),
    user: {
      firstName: author?.firstName ?? 'Beauty Bus customer',
      avatarUrl: author?.avatarUrl ?? null,
    },
  };

  persistReview(review);
  return ok(review, 201);
});

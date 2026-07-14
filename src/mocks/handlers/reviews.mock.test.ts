import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import axios, { isAxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { mockAdapter } from '../lib/mockEngine';
import './reviews.mock';
import { seedReviews } from '../data/reviews.data';
import { seedBookings } from '../data/bookings.data';
import { seedServices } from '../data/services.data';
import { reviewSchema } from '../../features/reviews/types/review.schema';
import type { Review } from '../../features/reviews/types/review';
import type { ApiFailure, ApiPaginated, ApiSuccess } from '../../types/api';

const client = axios.create({ adapter: mockAdapter });

const PRIYA_ID = '3f1c2a9e-8b4d-4c6a-9e2f-1a5b7c3d9e0f';
const RAHUL_ID = '7d4e5f2b-1c8a-4b3d-8f6e-2c9a0b1d4e7f';

function auth(userId: string): AxiosRequestConfig {
  const token = `mock-access.${userId}.${Date.now() + 60 * 60 * 1000}`;
  return { headers: { Authorization: `Bearer ${token}` } };
}

async function expectApiError(promise: Promise<unknown>, status: number, code: string) {
  try {
    await promise;
    expect.unreachable('expected request to fail');
  } catch (error) {
    if (!isAxiosError(error)) throw error;
    expect(error.response?.status).toBe(status);
    const body = error.response?.data as ApiFailure;
    expect(body.success).toBe(false);
    expect(body.error.code).toBe(code);
  }
}

/** Map-backed localStorage shim — Vitest runs in node (no DOM). */
function storageShim(): Storage {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, String(value)),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => [...store.keys()][index] ?? null,
    get length() {
      return store.size;
    },
  } as Storage;
}

const PRIYA_COMPLETED = seedBookings.filter(
  (booking) => booking.userId === PRIYA_ID && booking.status === 'COMPLETED',
);
/** Carries the seed review — used to prove the 409 duplicate path. */
const REVIEWED_BOOKING = PRIYA_COMPLETED[0];
/** Multi-service, deliberately un-reviewed — the happy-path booking. */
const FRESH_BOOKING = PRIYA_COMPLETED[1];
const PENDING_BOOKING = seedBookings.find(
  (booking) => booking.userId === PRIYA_ID && booking.status === 'PENDING',
);
const RAHUL_BOOKING = seedBookings.find((booking) => booking.userId === RAHUL_ID);

function validBody() {
  return {
    bookingId: FRESH_BOOKING.id,
    serviceId: FRESH_BOOKING.items[0].serviceId,
    rating: 5,
    comment: 'Wonderful doorstep experience — punctual, hygienic and relaxing.',
  };
}

beforeEach(() => {
  vi.stubGlobal('localStorage', storageShim());
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe('seed integrity', () => {
  it('every seed review matches the entity schema', () => {
    for (const review of seedReviews) {
      expect(() => reviewSchema.parse(review)).not.toThrow();
    }
  });

  it("Priya's seed review references her first COMPLETED booking and one of its services", () => {
    const priyaReview = seedReviews.find((review) => review.userId === PRIYA_ID);
    expect(priyaReview).toBeDefined();
    expect(priyaReview?.bookingId).toBe(REVIEWED_BOOKING.id);
    expect(REVIEWED_BOOKING.items.some((item) => item.serviceId === priyaReview?.serviceId)).toBe(
      true,
    );
  });

  it('every seed review points at a real seed service', () => {
    for (const review of seedReviews) {
      expect(seedServices.some((service) => service.id === review.serviceId)).toBe(true);
    }
  });

  it("the fresh COMPLETED booking really is un-reviewed and multi-service (guards the demo flows)", () => {
    expect(FRESH_BOOKING).toBeDefined();
    expect(FRESH_BOOKING.items.length).toBeGreaterThan(1);
    expect(seedReviews.some((review) => review.bookingId === FRESH_BOOKING.id)).toBe(false);
  });
});

describe('GET /services/:id/reviews', () => {
  const SERVICE_ID = REVIEWED_BOOKING.items[0].serviceId;

  it('is guest-accessible and returns only that service’s reviews, newest first', async () => {
    const res = await client.get<ApiPaginated<Review>>(`/services/${SERVICE_ID}/reviews`);
    expect(res.data.data.length).toBeGreaterThan(0);
    expect(res.data.data.every((review) => review.serviceId === SERVICE_ID)).toBe(true);
    const times = res.data.data.map((review) => review.createdAt);
    expect([...times].sort((a, b) => b.localeCompare(a))).toEqual(times);
  });

  it('paginates with the standard envelope', async () => {
    const res = await client.get<ApiPaginated<Review>>(`/services/${SERVICE_ID}/reviews`, {
      params: { page: 1, limit: 2 },
    });
    const seedCount = seedReviews.filter((review) => review.serviceId === SERVICE_ID).length;
    expect(res.data.pagination.totalItems).toBe(seedCount);
    expect(res.data.data.length).toBeLessThanOrEqual(2);
    expect(res.data.pagination.hasNextPage).toBe(seedCount > 2);
  });

  it('404s for an unknown service', async () => {
    await expectApiError(
      client.get(`/services/${crypto.randomUUID()}/reviews`),
      404,
      'RESOURCE_NOT_FOUND',
    );
  });

  it('supports scenario=empty and scenario=error', async () => {
    const empty = await client.get<ApiPaginated<Review>>(`/services/${SERVICE_ID}/reviews`, {
      params: { scenario: 'empty' },
    });
    expect(empty.data.data).toEqual([]);
    await expectApiError(
      client.get(`/services/${SERVICE_ID}/reviews`, { params: { scenario: 'error' } }),
      500,
      'INTERNAL_ERROR',
    );
  });
});

describe('POST /reviews', () => {
  it('requires auth', async () => {
    await expectApiError(client.post('/reviews', validBody()), 401, 'UNAUTHORIZED');
  });

  it('400s on malformed bodies (rating out of range, short comment)', async () => {
    await expectApiError(
      client.post('/reviews', { ...validBody(), rating: 0 }, auth(PRIYA_ID)),
      400,
      'VALIDATION_ERROR',
    );
    await expectApiError(
      client.post('/reviews', { ...validBody(), rating: 6 }, auth(PRIYA_ID)),
      400,
      'VALIDATION_ERROR',
    );
    await expectApiError(
      client.post('/reviews', { ...validBody(), comment: 'too short' }, auth(PRIYA_ID)),
      400,
      'VALIDATION_ERROR',
    );
  });

  it('400s on an unknown bookingId', async () => {
    await expectApiError(
      client.post('/reviews', { ...validBody(), bookingId: crypto.randomUUID() }, auth(PRIYA_ID)),
      400,
      'VALIDATION_ERROR',
    );
  });

  it("400s on another user's booking (indistinguishable from unknown)", async () => {
    await expectApiError(
      client.post(
        '/reviews',
        {
          ...validBody(),
          bookingId: RAHUL_BOOKING?.id,
          serviceId: RAHUL_BOOKING?.items[0]?.serviceId,
        },
        auth(PRIYA_ID),
      ),
      400,
      'VALIDATION_ERROR',
    );
  });

  it('400s when serviceId is not part of the booking', async () => {
    const foreignService = seedServices.find(
      (service) => !FRESH_BOOKING.items.some((item) => item.serviceId === service.id),
    );
    await expectApiError(
      client.post(
        '/reviews',
        { ...validBody(), serviceId: foreignService?.id },
        auth(PRIYA_ID),
      ),
      400,
      'VALIDATION_ERROR',
    );
  });

  it('422s when the booking is not COMPLETED', async () => {
    await expectApiError(
      client.post(
        '/reviews',
        {
          ...validBody(),
          bookingId: PENDING_BOOKING?.id,
          serviceId: PENDING_BOOKING?.items[0]?.serviceId,
        },
        auth(PRIYA_ID),
      ),
      422,
      'BUSINESS_RULE_VIOLATION',
    );
  });

  it('409s when a review already exists for the booking', async () => {
    await expectApiError(
      client.post(
        '/reviews',
        {
          ...validBody(),
          bookingId: REVIEWED_BOOKING.id,
          serviceId: REVIEWED_BOOKING.items[0].serviceId,
        },
        auth(PRIYA_ID),
      ),
      409,
      'CONFLICT',
    );
  });

  it('simulates a 500 when the comment contains FORCE_500', async () => {
    await expectApiError(
      client.post(
        '/reviews',
        { ...validBody(), comment: 'FORCE_500 — please fail this request.' },
        auth(PRIYA_ID),
      ),
      500,
      'INTERNAL_ERROR',
    );
  });

  it('201s with a schema-valid review (author expanded) and persists it into the list', async () => {
    const res = await client.post<ApiSuccess<Review>>('/reviews', validBody(), auth(PRIYA_ID));
    expect(res.status).toBe(201);
    const created = res.data.data;
    expect(() => reviewSchema.parse(created)).not.toThrow();
    expect(created.userId).toBe(PRIYA_ID);
    expect(created.user.firstName).toBe('Priya');

    const list = await client.get<ApiPaginated<Review>>(
      `/services/${created.serviceId}/reviews`,
    );
    expect(list.data.data[0]?.id).toBe(created.id);

    // The booking is now reviewed — a second attempt conflicts.
    await expectApiError(client.post('/reviews', validBody(), auth(PRIYA_ID)), 409, 'CONFLICT');
  });
});

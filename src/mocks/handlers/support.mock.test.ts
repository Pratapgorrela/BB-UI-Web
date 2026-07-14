import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import axios, { isAxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { mockAdapter } from '../lib/mockEngine';
import './support.mock';
import { seedFaqs } from '../data/faqs.data';
import { seedSupportRequests } from '../data/supportRequests.data';
import { seedBookings } from '../data/bookings.data';
import { faqSchema, supportRequestSchema } from '../../features/support/types/support.schema';
import type { Faq, SupportRequest } from '../../features/support/types/support';
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

const PRIYA_SEED = seedSupportRequests.filter((request) => request.userId === PRIYA_ID);
const PRIYA_COMPLETED_BOOKING = seedBookings.find(
  (booking) => booking.userId === PRIYA_ID && booking.status === 'COMPLETED',
);

const VALID_BODY = {
  issueType: 'SERVICE_QUALITY',
  description: 'The stylist arrived 40 minutes late and the session felt rushed.',
};

beforeEach(() => {
  vi.stubGlobal('localStorage', storageShim());
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe('seed integrity', () => {
  it('every seed FAQ matches the entity schema', () => {
    for (const faq of seedFaqs) {
      expect(() => faqSchema.parse(faq)).not.toThrow();
    }
  });

  it('every seed support request matches the entity schema', () => {
    for (const request of seedSupportRequests) {
      expect(() => supportRequestSchema.parse(request)).not.toThrow();
    }
  });

  it('the booking-linked seed request references a real seed booking', () => {
    const linked = seedSupportRequests.find((request) => request.bookingId !== null);
    expect(linked).toBeDefined();
    expect(linked?.bookingId).toBe(PRIYA_COMPLETED_BOOKING?.id);
    expect(linked?.bookingReferenceCode).toBe(PRIYA_COMPLETED_BOOKING?.referenceCode);
  });
});

describe('GET /faqs', () => {
  it('returns all FAQs sorted by sortOrder ascending, without auth', async () => {
    const res = await client.get<ApiSuccess<Faq[]>>('/faqs');
    expect(res.data.data).toHaveLength(seedFaqs.length);
    const orders = res.data.data.map((faq) => faq.sortOrder);
    expect([...orders].sort((a, b) => a - b)).toEqual(orders);
  });

  it('supports scenario=empty and scenario=error', async () => {
    const empty = await client.get<ApiSuccess<Faq[]>>('/faqs', { params: { scenario: 'empty' } });
    expect(empty.data.data).toEqual([]);
    await expectApiError(
      client.get('/faqs', { params: { scenario: 'error' } }),
      500,
      'INTERNAL_ERROR',
    );
  });
});

describe('GET /support-requests', () => {
  it('requires auth', async () => {
    await expectApiError(client.get('/support-requests'), 401, 'UNAUTHORIZED');
  });

  it('returns only the caller’s requests, newest first', async () => {
    const res = await client.get<ApiPaginated<SupportRequest>>('/support-requests', auth(PRIYA_ID));
    expect(res.data.data.every((request) => request.userId === PRIYA_ID)).toBe(true);
    expect(res.data.pagination.totalItems).toBe(PRIYA_SEED.length);
    const times = res.data.data.map((request) => request.createdAt);
    expect([...times].sort((a, b) => b.localeCompare(a))).toEqual(times);
  });

  it('scopes per user (Rahul cannot see Priya’s)', async () => {
    const res = await client.get<ApiPaginated<SupportRequest>>('/support-requests', auth(RAHUL_ID));
    expect(res.data.data.every((request) => request.userId === RAHUL_ID)).toBe(true);
    expect(res.data.pagination.totalItems).toBe(1);
  });

  it('paginates', async () => {
    const res = await client.get<ApiPaginated<SupportRequest>>('/support-requests', {
      ...auth(PRIYA_ID),
      params: { page: 1, limit: 1 },
    });
    expect(res.data.data).toHaveLength(1);
    expect(res.data.pagination.hasNextPage).toBe(true);
  });

  it('supports scenario=empty and scenario=error', async () => {
    const empty = await client.get<ApiPaginated<SupportRequest>>('/support-requests', {
      ...auth(PRIYA_ID),
      params: { scenario: 'empty' },
    });
    expect(empty.data.data).toEqual([]);
    await expectApiError(
      client.get('/support-requests', { ...auth(PRIYA_ID), params: { scenario: 'error' } }),
      500,
      'INTERNAL_ERROR',
    );
  });
});

describe('POST /support-requests', () => {
  it('requires auth', async () => {
    await expectApiError(client.post('/support-requests', VALID_BODY), 401, 'UNAUTHORIZED');
  });

  it('rejects an invalid issueType', async () => {
    await expectApiError(
      client.post('/support-requests', { ...VALID_BODY, issueType: 'WAT' }, auth(PRIYA_ID)),
      400,
      'VALIDATION_ERROR',
    );
  });

  it('rejects an empty description', async () => {
    await expectApiError(
      client.post('/support-requests', { ...VALID_BODY, description: '' }, auth(PRIYA_ID)),
      400,
      'VALIDATION_ERROR',
    );
  });

  it('rejects an unknown bookingId', async () => {
    await expectApiError(
      client.post(
        '/support-requests',
        { ...VALID_BODY, bookingId: crypto.randomUUID() },
        auth(PRIYA_ID),
      ),
      400,
      'VALIDATION_ERROR',
    );
  });

  it('rejects another user’s bookingId (owned-only)', async () => {
    await expectApiError(
      client.post(
        '/support-requests',
        { ...VALID_BODY, bookingId: PRIYA_COMPLETED_BOOKING?.id },
        auth(RAHUL_ID),
      ),
      400,
      'VALIDATION_ERROR',
    );
  });

  it('FORCE_500 in the description simulates a server failure', async () => {
    await expectApiError(
      client.post(
        '/support-requests',
        { ...VALID_BODY, description: 'FORCE_500 anything else' },
        auth(PRIYA_ID),
      ),
      500,
      'INTERNAL_ERROR',
    );
  });

  it('creates an OPEN request with an SR reference code (no booking)', async () => {
    const res = await client.post<ApiSuccess<SupportRequest>>(
      '/support-requests',
      VALID_BODY,
      auth(PRIYA_ID),
    );
    expect(res.status).toBe(201);
    const created = res.data.data;
    expect(() => supportRequestSchema.parse(created)).not.toThrow();
    expect(created.status).toBe('OPEN');
    expect(created.userId).toBe(PRIYA_ID);
    expect(created.referenceCode).toMatch(/^SR-\d{8}-[0-9A-F]{4}$/);
    expect(created.bookingId).toBeNull();
    expect(created.bookingReferenceCode).toBeNull();
  });

  it('snapshots the booking reference when a bookingId is provided', async () => {
    const res = await client.post<ApiSuccess<SupportRequest>>(
      '/support-requests',
      { ...VALID_BODY, bookingId: PRIYA_COMPLETED_BOOKING?.id },
      auth(PRIYA_ID),
    );
    expect(res.data.data.bookingId).toBe(PRIYA_COMPLETED_BOOKING?.id);
    expect(res.data.data.bookingReferenceCode).toBe(PRIYA_COMPLETED_BOOKING?.referenceCode);
  });

  it('persists the created request into the caller’s list', async () => {
    const created = await client.post<ApiSuccess<SupportRequest>>(
      '/support-requests',
      VALID_BODY,
      auth(PRIYA_ID),
    );
    const list = await client.get<ApiPaginated<SupportRequest>>(
      '/support-requests',
      auth(PRIYA_ID),
    );
    expect(list.data.pagination.totalItems).toBe(PRIYA_SEED.length + 1);
    expect(list.data.data[0]?.id).toBe(created.data.data.id);
  });
});

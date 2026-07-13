import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import axios, { isAxiosError } from 'axios';
import { mockAdapter } from '../lib/mockEngine';
import './booking.mock';
import { seedServices } from '../data/services.data';
import { seedSpecialists } from '../data/specialists.data';
import {
  bookingDetailSchema,
  bookingSchema,
  specialistSchema,
  timeSlotSchema,
} from '../../features/booking/types/booking.schema';
import { seedBookings } from '../data/bookings.data';
import { seedAddresses } from '../data/addresses.data';
import type {
  Booking,
  BookingDetail,
  BookingStatus,
  TimeSlot,
} from '../../features/booking/types/booking';
import type { PaymentSummary } from '../../features/cart/types/cart';
import { seedCoupons } from '../data/cart.data';
import type { ApiFailure, ApiPaginated, ApiSuccess } from '../../types/api';

// Requests go through the real mock adapter — the exact path the app uses.
const client = axios.create({ adapter: mockAdapter });

const ADDRESS_ID = 'a1e7c9d2-4b6f-4a1e-9c3d-7f2b8e5a1c40';
const STORAGE_KEY = 'bb-mock-bookings';

// Highest-priced service so coupon thresholds stay reachable (mirrors cart tests).
const service = seedServices.reduce((max, candidate) =>
  candidate.price.amount > max.price.amount ? candidate : max,
);

function validToken(): string {
  return `mock-access.test-user.${Date.now() + 60_000}`;
}

function authHeaders() {
  return { headers: { Authorization: `Bearer ${validToken()}` } };
}

function headersFor(userId: string) {
  return { headers: { Authorization: `Bearer mock-access.${userId}.${Date.now() + 60_000}` } };
}

// Seed fixtures — Priya owns one booking per status; Rahul's proves scoping.
const PRIYA_ID = seedBookings[0].userId;
const rahulSeed = seedBookings.find((booking) => booking.userId !== PRIYA_ID)!;
function priyaSeed(status: BookingStatus): Booking {
  return seedBookings.find(
    (booking) => booking.userId === PRIYA_ID && booking.status === status,
  )!;
}

async function fetchBookingsList(
  params: Record<string, string | number>,
  userId: string = PRIYA_ID,
): Promise<ApiPaginated<Booking>> {
  const response = await client.get<ApiPaginated<Booking>>('/bookings', {
    params,
    ...headersFor(userId),
  });
  return response.data;
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/** Local calendar date at `offsetDays` from today, as YYYY-MM-DD. */
function isoDate(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

async function fetchSlots(date: string): Promise<TimeSlot[]> {
  const response = await client.get<ApiSuccess<TimeSlot[]>>('/time-slots', { params: { date } });
  return response.data.data;
}

async function firstAvailableSlot(date: string): Promise<TimeSlot> {
  const slots = await fetchSlots(date);
  const available = slots.find((slot) => slot.isAvailable);
  expect(available).toBeDefined();
  return available!;
}

function bookingPayload(overrides: Record<string, unknown> = {}) {
  return {
    items: [{ serviceId: service.id, quantity: 1 }],
    couponCode: null,
    addressId: ADDRESS_ID,
    ...overrides,
  };
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

/** Map-backed localStorage shim — Vitest runs in the node environment (no DOM). */
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

beforeEach(() => {
  vi.stubGlobal('localStorage', storageShim());
});

afterAll(() => {
  vi.unstubAllGlobals();
});

const TOMORROW = isoDate(1);

describe('seed data integrity', () => {
  it('every seed specialist satisfies the contract schema', () => {
    for (const specialist of seedSpecialists) {
      expect(() => specialistSchema.parse(specialist)).not.toThrow();
    }
  });

  it('specialist serviceIds reference real seed services', () => {
    const serviceIds = new Set(seedServices.map((candidate) => candidate.id));
    for (const specialist of seedSpecialists) {
      expect(specialist.serviceIds.length).toBeGreaterThan(0);
      for (const id of specialist.serviceIds) {
        expect(serviceIds.has(id)).toBe(true);
      }
    }
  });
});

describe('GET /time-slots', () => {
  it('returns the full sorted grid of schema-valid slots with stable ids', async () => {
    const first = await fetchSlots(TOMORROW);
    const second = await fetchSlots(TOMORROW);

    expect(first).toHaveLength(10);
    expect(first.map((slot) => slot.startTime)).toEqual([...first.map((slot) => slot.startTime)].sort());
    for (const slot of first) {
      expect(() => timeSlotSchema.parse(slot)).not.toThrow();
      expect(slot.date).toBe(TOMORROW);
    }
    expect(second.map((slot) => slot.id)).toEqual(first.map((slot) => slot.id));
  });

  it('marks capacity-exhausted windows unavailable deterministically', async () => {
    const slots = await fetchSlots(TOMORROW);
    const dayOfMonth = Number(TOMORROW.slice(8, 10));
    for (const slot of slots) {
      const hour = Number(slot.startTime.slice(0, 2));
      if ((dayOfMonth + hour) % 4 === 0) expect(slot.isAvailable).toBe(false);
    }
    expect(slots.some((slot) => !slot.isAvailable)).toBe(true);
  });

  it('rejects a missing or malformed date with 400 details', async () => {
    await expectApiError(client.get('/time-slots'), 400, 'VALIDATION_ERROR');
    await expectApiError(
      client.get('/time-slots', { params: { date: '13-07-2026' } }),
      400,
      'VALIDATION_ERROR',
    );
  });

  it('supports scenario=empty and scenario=error', async () => {
    const empty = await client.get<ApiSuccess<TimeSlot[]>>('/time-slots', {
      params: { date: TOMORROW, scenario: 'empty' },
    });
    expect(empty.data.data).toEqual([]);
    await expectApiError(
      client.get('/time-slots', { params: { date: TOMORROW, scenario: 'error' } }),
      500,
      'INTERNAL_ERROR',
    );
  });

  it('returns an empty array for past dates and dates beyond the horizon', async () => {
    expect(await fetchSlots(isoDate(-1))).toEqual([]);
    expect(await fetchSlots(isoDate(20))).toEqual([]);
  });
});

describe('POST /bookings', () => {
  it('rejects an unauthenticated request with 401', async () => {
    const slot = await firstAvailableSlot(TOMORROW);
    await expectApiError(
      client.post('/bookings', bookingPayload({ timeSlotId: slot.id })),
      401,
      'UNAUTHORIZED',
    );
  });

  it('creates a schema-valid PENDING booking priced like /checkout/summary', async () => {
    const slot = await firstAvailableSlot(TOMORROW);
    const response = await client.post<ApiSuccess<Booking>>(
      '/bookings',
      bookingPayload({ timeSlotId: slot.id }),
      authHeaders(),
    );
    const booking = response.data.data;

    expect(response.status).toBe(201);
    expect(() => bookingSchema.parse(booking)).not.toThrow();
    expect(booking.status).toBe('PENDING');
    expect(booking.userId).toBe('test-user');
    expect(booking.addressId).toBe(ADDRESS_ID);
    expect(booking.duration).toBe(service.duration);
    expect(seedSpecialists.some((candidate) => candidate.id === booking.specialistId)).toBe(true);

    const [year, month, day] = slot.date.split('-').map(Number);
    const hour = Number(slot.startTime.slice(0, 2));
    expect(new Date(booking.scheduledAt).getTime()).toBe(
      new Date(year, month - 1, day, hour, 0, 0, 0).getTime(),
    );

    const summary = await client.post<ApiSuccess<PaymentSummary>>('/checkout/summary', {
      items: bookingPayload().items,
      couponCode: null,
    });
    expect(booking.paymentSummary.total).toEqual(summary.data.data.total);
    expect(booking.paymentSummary.serviceCharges).toEqual(summary.data.data.serviceCharges);
  });

  it('applies a coupon through the booking and enforces minSubtotal', async () => {
    const flat = seedCoupons.find((coupon) => coupon.discountType === 'FLAT');
    expect(flat).toBeDefined();
    const slot = await firstAvailableSlot(TOMORROW);
    const quantity = flat!.minSubtotal
      ? Math.ceil(flat!.minSubtotal.amount / service.price.amount)
      : 1;
    const response = await client.post<ApiSuccess<Booking>>(
      '/bookings',
      bookingPayload({
        items: [{ serviceId: service.id, quantity }],
        couponCode: flat!.code,
        timeSlotId: slot.id,
      }),
      authHeaders(),
    );
    expect(response.data.data.paymentSummary.appliedCoupon?.code).toBe(flat!.code);
    expect(response.data.data.paymentSummary.discount.amount).toBeGreaterThan(0);

    const gated = seedCoupons.find((coupon) => coupon.minSubtotal !== null);
    expect(gated).toBeDefined();
    const cheapest = seedServices.reduce((min, candidate) =>
      candidate.price.amount < min.price.amount ? candidate : min,
    );
    const laterSlot = (await fetchSlots(TOMORROW)).filter((s) => s.isAvailable).at(-1)!;
    await expectApiError(
      client.post(
        '/bookings',
        bookingPayload({
          items: [{ serviceId: cheapest.id, quantity: 1 }],
          couponCode: gated!.code,
          timeSlotId: laterSlot.id,
        }),
        authHeaders(),
      ),
      422,
      'BUSINESS_RULE_VIOLATION',
    );
  });

  it('rejects invalid payloads with 400 details', async () => {
    const slot = await firstAvailableSlot(TOMORROW);
    await expectApiError(
      client.post(
        '/bookings',
        bookingPayload({
          items: [{ serviceId: crypto.randomUUID(), quantity: 1 }],
          timeSlotId: slot.id,
        }),
        authHeaders(),
      ),
      400,
      'VALIDATION_ERROR',
    );
    await expectApiError(
      client.post('/bookings', bookingPayload({ items: [], timeSlotId: slot.id }), authHeaders()),
      400,
      'VALIDATION_ERROR',
    );
    await expectApiError(
      client.post(
        '/bookings',
        { items: bookingPayload().items, couponCode: null, timeSlotId: slot.id },
        authHeaders(),
      ),
      400,
      'VALIDATION_ERROR',
    );
    await expectApiError(
      client.post('/bookings', bookingPayload({ timeSlotId: 'not-a-uuid' }), authHeaders()),
      400,
      'VALIDATION_ERROR',
    );
  });

  it('returns 409 SLOT_UNAVAILABLE for the forced trigger, double-booking, and exhausted slots', async () => {
    const slot = await firstAvailableSlot(TOMORROW);
    await expectApiError(
      client.post(
        '/bookings',
        bookingPayload({ timeSlotId: slot.id, notes: 'FORCE_SLOT_UNAVAILABLE' }),
        authHeaders(),
      ),
      409,
      'SLOT_UNAVAILABLE',
    );

    await client.post('/bookings', bookingPayload({ timeSlotId: slot.id }), authHeaders());
    await expectApiError(
      client.post('/bookings', bookingPayload({ timeSlotId: slot.id }), authHeaders()),
      409,
      'SLOT_UNAVAILABLE',
    );

    const exhausted = (await fetchSlots(TOMORROW)).find(
      (candidate) => !candidate.isAvailable && candidate.id !== slot.id,
    );
    expect(exhausted).toBeDefined();
    await expectApiError(
      client.post('/bookings', bookingPayload({ timeSlotId: exhausted!.id }), authHeaders()),
      409,
      'SLOT_UNAVAILABLE',
    );
  });

  it('persists bookings to bb-mock-bookings and marks the window unavailable', async () => {
    const slot = await firstAvailableSlot(TOMORROW);
    const response = await client.post<ApiSuccess<Booking>>(
      '/bookings',
      bookingPayload({ timeSlotId: slot.id }),
      authHeaders(),
    );

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Booking[];
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(response.data.data.id);

    const refreshed = await fetchSlots(TOMORROW);
    expect(refreshed.find((candidate) => candidate.id === slot.id)?.isAvailable).toBe(false);
  });
});

describe('seed bookings integrity', () => {
  it('every seed booking satisfies the contract schema', () => {
    for (const booking of seedBookings) {
      expect(() => bookingSchema.parse(booking)).not.toThrow();
    }
  });

  it('covers every status for the primary user and references real seed records', () => {
    const statuses: BookingStatus[] = [
      'PENDING',
      'CONFIRMED',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED',
    ];
    for (const status of statuses) {
      expect(priyaSeed(status)).toBeDefined();
    }
    const specialistIds = new Set(seedSpecialists.map((candidate) => candidate.id));
    const addressIds = new Set(seedAddresses.map((candidate) => candidate.id));
    for (const booking of seedBookings) {
      expect(specialistIds.has(booking.specialistId)).toBe(true);
      expect(addressIds.has(booking.addressId)).toBe(true);
    }
    expect(rahulSeed).toBeDefined();
  });
});

describe('GET /bookings', () => {
  it('rejects an unauthenticated request with 401', async () => {
    await expectApiError(client.get('/bookings'), 401, 'UNAUTHORIZED');
  });

  it('returns only the callers bookings sorted by scheduledAt descending', async () => {
    const body = await fetchBookingsList({ limit: 50 });
    const ids = body.data.map((booking) => booking.id);

    expect(body.data.length).toBeGreaterThanOrEqual(6);
    expect(ids).not.toContain(rahulSeed.id);
    for (const booking of body.data) {
      expect(booking.userId).toBe(PRIYA_ID);
      expect(() => bookingSchema.parse(booking)).not.toThrow();
    }
    const times = body.data.map((booking) => new Date(booking.scheduledAt).getTime());
    expect(times).toEqual([...times].sort((a, b) => b - a));
  });

  it('filters by a single status and by a comma-separated list', async () => {
    const completed = await fetchBookingsList({ status: 'COMPLETED', limit: 50 });
    expect(completed.data.length).toBeGreaterThanOrEqual(2);
    expect(completed.data.every((booking) => booking.status === 'COMPLETED')).toBe(true);

    const upcoming = await fetchBookingsList({
      status: 'PENDING,CONFIRMED,IN_PROGRESS',
      limit: 50,
    });
    expect(upcoming.data.length).toBeGreaterThanOrEqual(3);
    expect(
      upcoming.data.every((booking) =>
        ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(booking.status),
      ),
    ).toBe(true);
  });

  it('rejects an unknown status with 400 details', async () => {
    await expectApiError(
      client.get('/bookings', { params: { status: 'BOGUS' }, ...headersFor(PRIYA_ID) }),
      400,
      'VALIDATION_ERROR',
    );
  });

  it('paginates with the standard envelope', async () => {
    const firstPage = await fetchBookingsList({ limit: 2 });
    expect(firstPage.data).toHaveLength(2);
    expect(firstPage.pagination.limit).toBe(2);
    expect(firstPage.pagination.totalItems).toBeGreaterThanOrEqual(6);
    expect(firstPage.pagination.hasNextPage).toBe(true);
    expect(firstPage.pagination.hasPreviousPage).toBe(false);

    const secondPage = await fetchBookingsList({ limit: 2, page: 2 });
    expect(secondPage.pagination.page).toBe(2);
    expect(secondPage.data.map((booking) => booking.id)).not.toEqual(
      firstPage.data.map((booking) => booking.id),
    );
  });

  it('merges bookings created via POST /bookings with the seeds', async () => {
    const slot = await firstAvailableSlot(TOMORROW);
    const created = await client.post<ApiSuccess<Booking>>(
      '/bookings',
      bookingPayload({ timeSlotId: slot.id }),
      headersFor(PRIYA_ID),
    );

    const body = await fetchBookingsList({ limit: 50 });
    expect(body.data.map((booking) => booking.id)).toContain(created.data.data.id);
  });

  it('supports scenario=empty and scenario=error', async () => {
    const empty = await fetchBookingsList({ scenario: 'empty' });
    expect(empty.data).toEqual([]);
    await expectApiError(
      client.get('/bookings', { params: { scenario: 'error' }, ...headersFor(PRIYA_ID) }),
      500,
      'INTERNAL_ERROR',
    );
  });
});

describe('GET /bookings/:id', () => {
  it('rejects an unauthenticated request with 401', async () => {
    await expectApiError(client.get(`/bookings/${seedBookings[0].id}`), 401, 'UNAUTHORIZED');
  });

  it('returns 404 for unknown ids and for another users booking', async () => {
    await expectApiError(
      client.get(`/bookings/${crypto.randomUUID()}`, headersFor(PRIYA_ID)),
      404,
      'RESOURCE_NOT_FOUND',
    );
    await expectApiError(
      client.get(`/bookings/${rahulSeed.id}`, headersFor(PRIYA_ID)),
      404,
      'RESOURCE_NOT_FOUND',
    );
  });

  it('expands the assigned specialist and address on the owners booking', async () => {
    const seed = priyaSeed('PENDING');
    const response = await client.get<ApiSuccess<BookingDetail>>(
      `/bookings/${seed.id}`,
      headersFor(PRIYA_ID),
    );
    const detail = response.data.data;

    expect(() => bookingDetailSchema.parse(detail)).not.toThrow();
    expect(detail.specialist.id).toBe(seed.specialistId);
    expect(detail.address.id).toBe(seed.addressId);
    expect(detail.address.line.length).toBeGreaterThan(0);
  });
});

describe('PATCH /bookings/:id/cancel', () => {
  const reason = { cancellationReason: 'Plans changed for that day.' };

  it('rejects unauthenticated, unknown, and cross-user requests', async () => {
    const seed = priyaSeed('PENDING');
    await expectApiError(client.patch(`/bookings/${seed.id}/cancel`, reason), 401, 'UNAUTHORIZED');
    await expectApiError(
      client.patch(`/bookings/${crypto.randomUUID()}/cancel`, reason, headersFor(PRIYA_ID)),
      404,
      'RESOURCE_NOT_FOUND',
    );
    await expectApiError(
      client.patch(`/bookings/${rahulSeed.id}/cancel`, reason, headersFor(PRIYA_ID)),
      404,
      'RESOURCE_NOT_FOUND',
    );
  });

  it('rejects an empty reason with 400 details', async () => {
    const seed = priyaSeed('PENDING');
    await expectApiError(
      client.patch(`/bookings/${seed.id}/cancel`, { cancellationReason: '  ' }, headersFor(PRIYA_ID)),
      400,
      'VALIDATION_ERROR',
    );
  });

  it('enforces the status rule with 422 for completed, cancelled, and in-progress bookings', async () => {
    for (const status of ['COMPLETED', 'CANCELLED', 'IN_PROGRESS'] as const) {
      await expectApiError(
        client.patch(`/bookings/${priyaSeed(status).id}/cancel`, reason, headersFor(PRIYA_ID)),
        422,
        'BUSINESS_RULE_VIOLATION',
      );
    }
  });

  it('enforces the 2-hour rule with 422', async () => {
    // The CONFIRMED seed is deliberately scheduled 90 minutes from now.
    await expectApiError(
      client.patch(`/bookings/${priyaSeed('CONFIRMED').id}/cancel`, reason, headersFor(PRIYA_ID)),
      422,
      'BUSINESS_RULE_VIOLATION',
    );
  });

  it('cancels a modifiable booking and upserts the mutated copy to localStorage', async () => {
    const seed = priyaSeed('PENDING');
    const response = await client.patch<ApiSuccess<Booking>>(
      `/bookings/${seed.id}/cancel`,
      reason,
      headersFor(PRIYA_ID),
    );
    const updated = response.data.data;

    expect(updated.status).toBe('CANCELLED');
    expect(updated.cancellationReason).toBe(reason.cancellationReason);
    expect(new Date(updated.updatedAt).getTime()).toBeGreaterThan(
      new Date(seed.updatedAt).getTime(),
    );

    // The seeds module itself is never mutated — localStorage wins on merge.
    expect(seed.status).toBe('PENDING');
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Booking[];
    expect(stored.some((booking) => booking.id === seed.id && booking.status === 'CANCELLED')).toBe(
      true,
    );

    const cancelledList = await fetchBookingsList({ status: 'CANCELLED', limit: 50 });
    expect(cancelledList.data.map((booking) => booking.id)).toContain(seed.id);
  });
});

describe('PATCH /bookings/:id/reschedule', () => {
  it('rejects a malformed timeSlotId with 400 details', async () => {
    const seed = priyaSeed('PENDING');
    await expectApiError(
      client.patch(
        `/bookings/${seed.id}/reschedule`,
        { timeSlotId: 'not-a-uuid' },
        headersFor(PRIYA_ID),
      ),
      400,
      'VALIDATION_ERROR',
    );
  });

  it('enforces the status and 2-hour rules with 422', async () => {
    const slot = await firstAvailableSlot(TOMORROW);
    await expectApiError(
      client.patch(
        `/bookings/${priyaSeed('COMPLETED').id}/reschedule`,
        { timeSlotId: slot.id },
        headersFor(PRIYA_ID),
      ),
      422,
      'BUSINESS_RULE_VIOLATION',
    );
    await expectApiError(
      client.patch(
        `/bookings/${priyaSeed('CONFIRMED').id}/reschedule`,
        { timeSlotId: slot.id },
        headersFor(PRIYA_ID),
      ),
      422,
      'BUSINESS_RULE_VIOLATION',
    );
  });

  it('returns 409 for exhausted slots and windows already booked by anyone', async () => {
    const seed = priyaSeed('PENDING');
    const exhausted = (await fetchSlots(TOMORROW)).find((candidate) => !candidate.isAvailable);
    expect(exhausted).toBeDefined();
    await expectApiError(
      client.patch(
        `/bookings/${seed.id}/reschedule`,
        { timeSlotId: exhausted!.id },
        headersFor(PRIYA_ID),
      ),
      409,
      'SLOT_UNAVAILABLE',
    );

    const slot = await firstAvailableSlot(TOMORROW);
    await client.post('/bookings', bookingPayload({ timeSlotId: slot.id }), authHeaders());
    await expectApiError(
      client.patch(
        `/bookings/${seed.id}/reschedule`,
        { timeSlotId: slot.id },
        headersFor(PRIYA_ID),
      ),
      409,
      'SLOT_UNAVAILABLE',
    );
  });

  it('reschedules a modifiable booking, preserving status and swapping the windows', async () => {
    const seed = priyaSeed('PENDING');
    const target = await firstAvailableSlot(TOMORROW);
    const response = await client.patch<ApiSuccess<Booking>>(
      `/bookings/${seed.id}/reschedule`,
      { timeSlotId: target.id },
      headersFor(PRIYA_ID),
    );
    const updated = response.data.data;

    const [year, month, day] = target.date.split('-').map(Number);
    const hour = Number(target.startTime.slice(0, 2));
    expect(new Date(updated.scheduledAt).getTime()).toBe(
      new Date(year, month - 1, day, hour, 0, 0, 0).getTime(),
    );
    expect(updated.status).toBe('PENDING');

    // New window is now taken; the old window frees up unless capacity-exhausted.
    const newDaySlots = await fetchSlots(target.date);
    expect(newDaySlots.find((candidate) => candidate.id === target.id)?.isAvailable).toBe(false);

    const oldInstant = new Date(seed.scheduledAt);
    const oldDateStr = `${oldInstant.getFullYear()}-${pad2(oldInstant.getMonth() + 1)}-${pad2(
      oldInstant.getDate(),
    )}`;
    const oldSlots = await fetchSlots(oldDateStr);
    const oldWindow = oldSlots.find(
      (candidate) => Number(candidate.startTime.slice(0, 2)) === oldInstant.getHours(),
    );
    const expectedAvailable = (oldInstant.getDate() + oldInstant.getHours()) % 4 !== 0;
    expect(oldWindow?.isAvailable).toBe(expectedAvailable);
  });
});

import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import axios, { isAxiosError } from 'axios';
import { mockAdapter } from '../lib/mockEngine';
import './booking.mock';
import { seedServices } from '../data/services.data';
import { seedSpecialists } from '../data/specialists.data';
import {
  bookingSchema,
  specialistSchema,
  timeSlotSchema,
} from '../../features/booking/types/booking.schema';
import type { Booking, TimeSlot } from '../../features/booking/types/booking';
import type { PaymentSummary } from '../../features/cart/types/cart';
import { seedCoupons } from '../data/cart.data';
import type { ApiFailure, ApiSuccess } from '../../types/api';

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

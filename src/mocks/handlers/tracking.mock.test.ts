import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import axios, { isAxiosError } from 'axios';
import { mockAdapter } from '../lib/mockEngine';
import './tracking.mock';
import { seedBookings } from '../data/bookings.data';
import { seedVans } from '../data/vans.data';
import { seedAddresses } from '../data/addresses.data';
import {
  vanSchema,
  vanTrackingSchema,
} from '../../features/booking/types/booking.schema';
import type {
  Booking,
  BookingStatus,
  VanTracking,
} from '../../features/booking/types/booking';
import type { ApiFailure, ApiSuccess } from '../../types/api';

// Requests go through the real mock adapter — the exact path the app uses.
const client = axios.create({ adapter: mockAdapter });

const STORAGE_KEY = 'bb-mock-bookings';

// Seed fixtures — Priya owns one booking per status; Rahul's proves scoping.
const PRIYA_ID = seedBookings[0].userId;
const rahulSeed = seedBookings.find((booking) => booking.userId !== PRIYA_ID)!;
function priyaSeed(status: BookingStatus): Booking {
  return seedBookings.find(
    (booking) => booking.userId === PRIYA_ID && booking.status === status,
  )!;
}

function headersFor(userId: string) {
  return { headers: { Authorization: `Bearer mock-access.${userId}.${Date.now() + 60_000}` } };
}

async function fetchTracking(id: string, userId: string = PRIYA_ID): Promise<VanTracking> {
  const response = await client.get<ApiSuccess<VanTracking>>(
    `/bookings/${id}/tracking`,
    headersFor(userId),
  );
  return response.data.data;
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

describe('seed data integrity', () => {
  it('every seed van satisfies the contract schema', () => {
    expect(seedVans.length).toBeGreaterThan(0);
    for (const van of seedVans) {
      expect(() => vanSchema.parse(van)).not.toThrow();
    }
  });
});

describe('GET /bookings/:id/tracking', () => {
  it('rejects unauthenticated requests with 401', async () => {
    await expectApiError(
      client.get(`/bookings/${priyaSeed('CONFIRMED').id}/tracking`),
      401,
      'UNAUTHORIZED',
    );
  });

  it('returns 404 for an unknown booking id', async () => {
    await expectApiError(
      fetchTracking('00000000-0000-4000-8000-000000000000'),
      404,
      'RESOURCE_NOT_FOUND',
    );
  });

  it("returns 404 for another user's booking (invisible, not forbidden)", async () => {
    await expectApiError(fetchTracking(rahulSeed.id, PRIYA_ID), 404, 'RESOURCE_NOT_FOUND');
  });

  it.each(['COMPLETED', 'CANCELLED'] as const)(
    'returns 422 for a %s booking — tracking only exists while active',
    async (status) => {
      await expectApiError(
        fetchTracking(priyaSeed(status).id),
        422,
        'BUSINESS_RULE_VIOLATION',
      );
    },
  );

  it('supports scenario=error → 500', async () => {
    await expectApiError(
      client.get(
        `/bookings/${priyaSeed('CONFIRMED').id}/tracking`,
        { params: { scenario: 'error' }, ...headersFor(PRIYA_ID) },
      ),
      500,
      'INTERNAL_ERROR',
    );
  });

  it('PENDING booking → NOT_DISPATCHED with null eta and null location', async () => {
    const tracking = await fetchTracking(priyaSeed('PENDING').id);
    expect(() => vanTrackingSchema.parse(tracking)).not.toThrow();
    expect(tracking.status).toBe('NOT_DISPATCHED');
    expect(tracking.etaMinutes).toBeNull();
    expect(tracking.currentLocation).toBeNull();
  });

  it('CONFIRMED booking far out → EN_ROUTE with the eta clamped to 45', async () => {
    // The seed CONFIRMED booking sits ~90 minutes out (the 2h-lock demo).
    const booking = priyaSeed('CONFIRMED');
    const tracking = await fetchTracking(booking.id);
    expect(() => vanTrackingSchema.parse(tracking)).not.toThrow();
    expect(tracking.bookingId).toBe(booking.id);
    expect(tracking.status).toBe('EN_ROUTE');
    expect(tracking.etaMinutes).toBe(45);
    expect(tracking.currentLocation).not.toBeNull();
    expect(tracking.specialist.id).toBe(booking.specialistId);
  });

  it('CONFIRMED booking ≤15 minutes out → ARRIVING with a real eta', async () => {
    const soon: Booking = {
      ...priyaSeed('CONFIRMED'),
      id: 'bb8f0000-0000-4000-8000-999999999901',
      scheduledAt: new Date(Date.now() + 10 * 60_000).toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([soon]));

    const tracking = await fetchTracking(soon.id);
    expect(tracking.status).toBe('ARRIVING');
    expect(tracking.etaMinutes).toBe(10);
  });

  it('IN_PROGRESS booking → ARRIVED at the destination with eta 0', async () => {
    const booking = priyaSeed('IN_PROGRESS');
    const tracking = await fetchTracking(booking.id);
    expect(() => vanTrackingSchema.parse(tracking)).not.toThrow();
    expect(tracking.status).toBe('ARRIVED');
    expect(tracking.etaMinutes).toBe(0);

    // The booking address is a geocoded seed — the van sits exactly on it.
    const address = seedAddresses.find((candidate) => candidate.id === booking.addressId);
    if (address?.latitude !== null && address?.longitude !== null) {
      expect(tracking.currentLocation).toEqual({
        latitude: address?.latitude,
        longitude: address?.longitude,
      });
    }
  });

  it('expands the destination from the real address record', async () => {
    const booking = priyaSeed('CONFIRMED');
    const address = seedAddresses.find((candidate) => candidate.id === booking.addressId)!;
    const tracking = await fetchTracking(booking.id);
    expect(tracking.destination.label).toBe(address.label);
    expect(tracking.destination.line.length).toBeGreaterThan(0);
    expect(tracking.destination.latitude).toBe(address.latitude);
    expect(tracking.destination.longitude).toBe(address.longitude);
  });

  it('assigns the van deterministically — same booking, same van', async () => {
    const booking = priyaSeed('CONFIRMED');
    const first = await fetchTracking(booking.id);
    const second = await fetchTracking(booking.id);
    expect(first.van).toEqual(second.van);
    expect(seedVans.some((van) => van.vanCode === first.van.vanCode)).toBe(true);
  });
});

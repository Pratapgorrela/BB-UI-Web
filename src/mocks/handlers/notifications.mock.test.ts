import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import axios, { isAxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { mockAdapter } from '../lib/mockEngine';
import './notifications.mock';
import { seedNotifications } from '../data/notifications.data';
import {
  notificationSchema,
  notificationSettingsSchema,
} from '../../features/notifications/types/notification.schema';
import type {
  MarkAllReadResult,
  Notification,
  NotificationSettings,
  UnreadCount,
} from '../../features/notifications/types/notification';
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

const PRIYA_SEED = seedNotifications.filter((n) => n.userId === PRIYA_ID);
const PRIYA_UNREAD = PRIYA_SEED.filter((n) => !n.isRead).length;

beforeEach(() => {
  vi.stubGlobal('localStorage', storageShim());
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe('seed integrity', () => {
  it('every seed notification matches the entity schema', () => {
    for (const notification of seedNotifications) {
      expect(() => notificationSchema.parse(notification)).not.toThrow();
    }
  });
});

describe('GET /notifications', () => {
  it('requires auth', async () => {
    await expectApiError(client.get('/notifications'), 401, 'UNAUTHORIZED');
  });

  it('returns only the caller’s notifications, newest first', async () => {
    const res = await client.get<ApiPaginated<Notification>>('/notifications', auth(PRIYA_ID));
    expect(res.data.data.every((n) => n.userId === PRIYA_ID)).toBe(true);
    expect(res.data.pagination.totalItems).toBe(PRIYA_SEED.length);
    const times = res.data.data.map((n) => n.createdAt);
    expect([...times].sort((a, b) => b.localeCompare(a))).toEqual(times);
  });

  it('scopes per user (Rahul cannot see Priya’s)', async () => {
    const res = await client.get<ApiPaginated<Notification>>('/notifications', auth(RAHUL_ID));
    expect(res.data.data.every((n) => n.userId === RAHUL_ID)).toBe(true);
    expect(res.data.pagination.totalItems).toBe(1);
  });

  it('filters by category=OFFER (PROMO only)', async () => {
    const res = await client.get<ApiPaginated<Notification>>('/notifications', {
      ...auth(PRIYA_ID),
      params: { category: 'OFFER' },
    });
    expect(res.data.data.every((n) => n.type === 'PROMO')).toBe(true);
  });

  it('filters by category=BOOKING (everything but PROMO)', async () => {
    const res = await client.get<ApiPaginated<Notification>>('/notifications', {
      ...auth(PRIYA_ID),
      params: { category: 'BOOKING' },
    });
    expect(res.data.data.every((n) => n.type !== 'PROMO')).toBe(true);
  });

  it('rejects an unknown category', async () => {
    await expectApiError(
      client.get('/notifications', { ...auth(PRIYA_ID), params: { category: 'WAT' } }),
      400,
      'VALIDATION_ERROR',
    );
  });

  it('paginates', async () => {
    const res = await client.get<ApiPaginated<Notification>>('/notifications', {
      ...auth(PRIYA_ID),
      params: { page: 1, limit: 3 },
    });
    expect(res.data.data).toHaveLength(3);
    expect(res.data.pagination.hasNextPage).toBe(true);
  });

  it('supports scenario=empty and scenario=error', async () => {
    const empty = await client.get<ApiPaginated<Notification>>('/notifications', {
      ...auth(PRIYA_ID),
      params: { scenario: 'empty' },
    });
    expect(empty.data.data).toHaveLength(0);
    await expectApiError(
      client.get('/notifications', { ...auth(PRIYA_ID), params: { scenario: 'error' } }),
      500,
      'INTERNAL_ERROR',
    );
  });
});

describe('GET /notifications/unread-count', () => {
  it('counts the caller’s unread notifications', async () => {
    const res = await client.get<ApiSuccess<UnreadCount>>(
      '/notifications/unread-count',
      auth(PRIYA_ID),
    );
    expect(res.data.data.count).toBe(PRIYA_UNREAD);
  });

  it('requires auth', async () => {
    await expectApiError(client.get('/notifications/unread-count'), 401, 'UNAUTHORIZED');
  });
});

describe('PATCH /notifications/:id/read', () => {
  it('marks one read and drops the unread count', async () => {
    const target = PRIYA_SEED.find((n) => !n.isRead)!;
    const res = await client.patch<ApiSuccess<Notification>>(
      `/notifications/${target.id}/read`,
      {},
      auth(PRIYA_ID),
    );
    expect(res.data.data.isRead).toBe(true);
    const count = await client.get<ApiSuccess<UnreadCount>>(
      '/notifications/unread-count',
      auth(PRIYA_ID),
    );
    expect(count.data.data.count).toBe(PRIYA_UNREAD - 1);
  });

  it('404s another user’s notification', async () => {
    const target = PRIYA_SEED[0];
    await expectApiError(
      client.patch(`/notifications/${target.id}/read`, {}, auth(RAHUL_ID)),
      404,
      'RESOURCE_NOT_FOUND',
    );
  });
});

describe('PATCH /notifications/mark-all-read', () => {
  it('flips every unread and reports the count', async () => {
    const res = await client.patch<ApiSuccess<MarkAllReadResult>>(
      '/notifications/mark-all-read',
      {},
      auth(PRIYA_ID),
    );
    expect(res.data.data.updated).toBe(PRIYA_UNREAD);
    const count = await client.get<ApiSuccess<UnreadCount>>(
      '/notifications/unread-count',
      auth(PRIYA_ID),
    );
    expect(count.data.data.count).toBe(0);
  });
});

describe('DELETE /notifications/:id', () => {
  it('dismisses and removes from the list (persists)', async () => {
    const target = PRIYA_SEED[0];
    await client.delete(`/notifications/${target.id}`, auth(PRIYA_ID));
    const res = await client.get<ApiPaginated<Notification>>('/notifications', auth(PRIYA_ID));
    expect(res.data.data.find((n) => n.id === target.id)).toBeUndefined();
    expect(res.data.pagination.totalItems).toBe(PRIYA_SEED.length - 1);
  });

  it('404s another user’s notification', async () => {
    const target = PRIYA_SEED[0];
    await expectApiError(
      client.delete(`/notifications/${target.id}`, auth(RAHUL_ID)),
      404,
      'RESOURCE_NOT_FOUND',
    );
  });
});

describe('notification settings', () => {
  it('returns all-on defaults for a fresh user', async () => {
    const res = await client.get<ApiSuccess<NotificationSettings>>(
      '/notification-settings',
      auth(PRIYA_ID),
    );
    expect(() => notificationSettingsSchema.parse(res.data.data)).not.toThrow();
    expect(res.data.data.bookingUpdates).toBe(true);
    expect(res.data.data.whatsappEnabled).toBe(false);
  });

  it('patches partially and persists', async () => {
    await client.patch<ApiSuccess<NotificationSettings>>(
      '/notification-settings',
      { servicePromotions: false, whatsappEnabled: true },
      auth(PRIYA_ID),
    );
    const res = await client.get<ApiSuccess<NotificationSettings>>(
      '/notification-settings',
      auth(PRIYA_ID),
    );
    expect(res.data.data.servicePromotions).toBe(false);
    expect(res.data.data.whatsappEnabled).toBe(true);
    expect(res.data.data.bookingUpdates).toBe(true); // untouched
  });

  it('rejects a malformed body', async () => {
    await expectApiError(
      client.patch('/notification-settings', { bookingUpdates: 'yes' }, auth(PRIYA_ID)),
      400,
      'VALIDATION_ERROR',
    );
    await expectApiError(client.get('/notification-settings'), 401, 'UNAUTHORIZED');
  });
});

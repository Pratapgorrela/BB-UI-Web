import { fail, ok, paginated, registerMock } from '../lib/mockEngine';
import { requireAuth } from '../lib/guards';
import { toValidationDetails } from './cart.mock';
import {
  defaultNotificationSettings,
  seedNotifications,
} from '../data/notifications.data';
import {
  notificationCategorySchema,
  updateNotificationSettingsRequestSchema,
} from '../../features/notifications/types/notification.schema';
import type {
  Notification,
  NotificationCategory,
  NotificationSettings,
  NotificationType,
} from '../../features/notifications/types/notification';

const NOTIFICATIONS_KEY = 'bb-mock-notifications';
const NOTIFICATIONS_DELETED_KEY = 'bb-mock-notifications-deleted';
const SETTINGS_KEY = 'bb-mock-notif-settings';

/* ── Guarded persistence (Vitest runs in node; private mode can throw) ── */

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = globalThis.localStorage?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown): void {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — mutations just won't survive reload */
  }
}

/* ── Notification overlay store (seed ∪ stored − tombstoned) ── */

function readStored(): Notification[] {
  return readStorage<Notification[]>(NOTIFICATIONS_KEY, []);
}

function readDeleted(): string[] {
  return readStorage<string[]>(NOTIFICATIONS_DELETED_KEY, []);
}

/** The full notification universe: seeds overlaid by stored edits, minus tombstones. */
function allNotifications(): Notification[] {
  const stored = readStored();
  const deleted = new Set(readDeleted());
  const byId = new Map<string, Notification>();
  for (const notification of seedNotifications) byId.set(notification.id, notification);
  for (const notification of stored) byId.set(notification.id, notification);
  for (const id of deleted) byId.delete(id);
  return [...byId.values()];
}

/** A user's notifications, newest first. */
function notificationsForUser(userId: string): Notification[] {
  return allNotifications()
    .filter((notification) => notification.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function upsertNotification(updated: Notification): void {
  const stored = readStored();
  const index = stored.findIndex((notification) => notification.id === updated.id);
  if (index === -1) writeStorage(NOTIFICATIONS_KEY, [...stored, updated]);
  else writeStorage(NOTIFICATIONS_KEY, stored.map((n) => (n.id === updated.id ? updated : n)));
}

function tombstoneNotification(id: string): void {
  writeStorage(NOTIFICATIONS_KEY, readStored().filter((notification) => notification.id !== id));
  const deleted = readDeleted();
  if (!deleted.includes(id)) writeStorage(NOTIFICATIONS_DELETED_KEY, [...deleted, id]);
}

/** Map a notification `type` to its tab category (derived, not stored). */
function categoryOf(type: NotificationType): NotificationCategory {
  return type === 'PROMO' ? 'OFFER' : 'BOOKING';
}

/* ── Settings override store (keyed by userId) ── */

type SettingsOverrides = Record<string, NotificationSettings>;

function resolveSettings(userId: string): NotificationSettings {
  const stored = readStorage<SettingsOverrides>(SETTINGS_KEY, {})[userId];
  return stored ?? defaultNotificationSettings(userId);
}

/* ── GET /notifications ── */

registerMock('GET', '/notifications', (req) => {
  const path = '/api/v1/notifications';
  const userId = requireAuth(req, path);

  const scenario = req.query.get('scenario');
  if (scenario === 'error') {
    return fail(500, 'INTERNAL_ERROR', 'Simulated server error. Please try again later.', path);
  }

  const page = Math.max(1, Number(req.query.get('page')) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.get('limit')) || 20));

  let items = scenario === 'empty' ? [] : notificationsForUser(userId);

  const rawCategory = req.query.get('category');
  if (rawCategory) {
    const parsed = notificationCategorySchema.safeParse(rawCategory);
    if (!parsed.success) {
      return fail(400, 'VALIDATION_ERROR', 'Invalid category filter.', path, [
        { field: 'category', message: 'Expected BOOKING or OFFER.' },
      ]);
    }
    items = items.filter((notification) => categoryOf(notification.type) === parsed.data);
  }

  return paginated(items, page, limit);
});

/* ── GET /notifications/unread-count ── */

registerMock('GET', '/notifications/unread-count', (req) => {
  const path = '/api/v1/notifications/unread-count';
  const userId = requireAuth(req, path);
  const count = notificationsForUser(userId).filter((notification) => !notification.isRead).length;
  return ok({ count });
});

/* ── PATCH /notifications/mark-all-read ── */

registerMock('PATCH', '/notifications/mark-all-read', (req) => {
  const path = '/api/v1/notifications/mark-all-read';
  const userId = requireAuth(req, path);

  let updated = 0;
  for (const notification of notificationsForUser(userId)) {
    if (!notification.isRead) {
      upsertNotification({ ...notification, isRead: true });
      updated += 1;
    }
  }
  return ok({ updated });
});

/* ── PATCH /notifications/:id/read ── */

registerMock('PATCH', '/notifications/:id/read', (req) => {
  const path = `/api/v1/notifications/${req.params.id}/read`;
  const userId = requireAuth(req, path);

  const existing = allNotifications().find((notification) => notification.id === req.params.id);
  if (!existing || existing.userId !== userId) {
    return fail(404, 'RESOURCE_NOT_FOUND', 'Notification not found.', path);
  }

  const updated: Notification = { ...existing, isRead: true };
  if (!existing.isRead) upsertNotification(updated);
  return ok(updated);
});

/* ── DELETE /notifications/:id ── */

registerMock('DELETE', '/notifications/:id', (req) => {
  const path = `/api/v1/notifications/${req.params.id}`;
  const userId = requireAuth(req, path);

  const existing = allNotifications().find((notification) => notification.id === req.params.id);
  if (!existing || existing.userId !== userId) {
    return fail(404, 'RESOURCE_NOT_FOUND', 'Notification not found.', path);
  }

  tombstoneNotification(existing.id);
  return ok(null);
});

/* ── GET /notification-settings ── */

registerMock('GET', '/notification-settings', (req) => {
  const path = '/api/v1/notification-settings';
  const userId = requireAuth(req, path);
  return ok(resolveSettings(userId));
});

/* ── PATCH /notification-settings ── */

registerMock('PATCH', '/notification-settings', (req) => {
  const path = '/api/v1/notification-settings';
  const userId = requireAuth(req, path);

  const parsed = updateNotificationSettingsRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(
      400,
      'VALIDATION_ERROR',
      'Request validation failed.',
      path,
      toValidationDetails(parsed.error.issues),
    );
  }

  const overrides = readStorage<SettingsOverrides>(SETTINGS_KEY, {});
  const updated: NotificationSettings = {
    ...resolveSettings(userId),
    ...parsed.data,
    updatedAt: new Date().toISOString(),
  };
  overrides[userId] = updated;
  writeStorage(SETTINGS_KEY, overrides);
  return ok(updated);
});

export { allNotifications, categoryOf };

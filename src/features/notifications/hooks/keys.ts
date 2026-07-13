import type { NotificationListFilters } from '../types/notification';

/** 30s stale window — the feed is not high-frequency. */
export const NOTIFICATIONS_STALE_TIME_MS = 30_000;

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters: { category: string; page: number }) =>
    [...notificationKeys.lists(), filters] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
  settings: () => [...notificationKeys.all, 'settings'] as const,
};

export function listFilterKey(filters: NotificationListFilters) {
  return { category: filters.category ?? 'ALL', page: filters.page ?? 1 };
}

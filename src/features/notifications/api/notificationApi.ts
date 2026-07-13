import { apiClient } from '../../../lib/apiClient';
import type { ApiPaginated, ApiSuccess } from '../../../types/api';
import type {
  MarkAllReadResult,
  Notification,
  NotificationListFilters,
  NotificationSettings,
  NotificationsPage,
  UnreadCount,
  UpdateNotificationSettingsRequest,
} from '../types/notification';

async function fetchNotifications(
  filters: NotificationListFilters = {},
): Promise<NotificationsPage> {
  const params: Record<string, string | number> = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
  };
  if (filters.category) params.category = filters.category;

  const response = await apiClient.get<ApiPaginated<Notification>>('/notifications', { params });
  return { notifications: response.data.data, pagination: response.data.pagination };
}

async function fetchUnreadCount(): Promise<number> {
  const response = await apiClient.get<ApiSuccess<UnreadCount>>('/notifications/unread-count');
  return response.data.data.count;
}

async function markNotificationRead(id: string): Promise<Notification> {
  const response = await apiClient.patch<ApiSuccess<Notification>>(`/notifications/${id}/read`);
  return response.data.data;
}

async function markAllNotificationsRead(): Promise<MarkAllReadResult> {
  const response = await apiClient.patch<ApiSuccess<MarkAllReadResult>>(
    '/notifications/mark-all-read',
  );
  return response.data.data;
}

async function dismissNotification(id: string): Promise<null> {
  const response = await apiClient.delete<ApiSuccess<null>>(`/notifications/${id}`);
  return response.data.data;
}

async function fetchNotificationSettings(): Promise<NotificationSettings> {
  const response = await apiClient.get<ApiSuccess<NotificationSettings>>('/notification-settings');
  return response.data.data;
}

async function updateNotificationSettings(
  payload: UpdateNotificationSettingsRequest,
): Promise<NotificationSettings> {
  const response = await apiClient.patch<ApiSuccess<NotificationSettings>>(
    '/notification-settings',
    payload,
  );
  return response.data.data;
}

export {
  dismissNotification,
  fetchNotifications,
  fetchNotificationSettings,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  updateNotificationSettings,
};

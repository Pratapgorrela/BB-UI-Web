import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotifications } from '../api/notificationApi';
import { NOTIFICATIONS_STALE_TIME_MS, listFilterKey, notificationKeys } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';
import type { NotificationListFilters } from '../types/notification';

/** The caller's notifications, filtered by category and paginated (`createdAt` DESC). */
export function useFetchNotifications(filters: NotificationListFilters = {}) {
  return useQuery({
    queryKey: notificationKeys.list(listFilterKey(filters)),
    queryFn: async () => {
      try {
        return await fetchNotifications(filters);
      } catch (error) {
        console.error('[Notifications] Failed to fetch notifications:', getApiErrorMessage(error));
        throw error;
      }
    },
    placeholderData: keepPreviousData,
    staleTime: NOTIFICATIONS_STALE_TIME_MS,
    retry: false,
  });
}

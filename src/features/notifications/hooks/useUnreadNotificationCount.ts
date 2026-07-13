import { useQuery } from '@tanstack/react-query';
import { fetchUnreadCount } from '../api/notificationApi';
import { NOTIFICATIONS_STALE_TIME_MS, notificationKeys } from './keys';
import { useAuthStore } from '../../../store/useAuthStore';

/**
 * Unread notification count for the nav badge. Only runs when authenticated
 * (the endpoint is auth-guarded); invalidated by read / mark-all / dismiss.
 */
export function useUnreadNotificationCount() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: fetchUnreadCount,
    enabled: isAuthenticated,
    staleTime: NOTIFICATIONS_STALE_TIME_MS,
    retry: false,
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markNotificationRead } from '../api/notificationApi';
import { notificationKeys } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';

/** Mark a single notification read (fired when a card is opened/tapped). */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: (notification) => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      console.log('[Notifications] Marked read:', notification.id);
    },
    onError: (error) => {
      console.error('[Notifications] Failed to mark read:', getApiErrorMessage(error));
    },
  });
}

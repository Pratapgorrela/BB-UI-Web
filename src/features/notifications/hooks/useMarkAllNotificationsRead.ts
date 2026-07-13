import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAllNotificationsRead } from '../api/notificationApi';
import { notificationKeys } from './keys';
import { useToast } from '../../../components/ui';
import { getApiErrorMessage } from '../../../utils/apiError';

/** Mark every notification read ("Mark all read" action). */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: ({ updated }) => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      addToast(updated > 0 ? 'All notifications marked as read.' : 'You’re all caught up.', 'success');
      console.log('[Notifications] Marked all read:', updated);
    },
    onError: (error) => {
      console.error('[Notifications] Failed to mark all read:', getApiErrorMessage(error));
      addToast(getApiErrorMessage(error), 'error');
    },
  });
}

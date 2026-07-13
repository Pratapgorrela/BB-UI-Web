import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dismissNotification } from '../api/notificationApi';
import { notificationKeys } from './keys';
import { useToast } from '../../../components/ui';
import { getApiErrorMessage } from '../../../utils/apiError';

/** Dismiss (remove) a notification — the X on each alert card. */
export function useDismissNotification() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: dismissNotification,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      console.log('[Notifications] Notification dismissed');
    },
    onError: (error) => {
      console.error('[Notifications] Failed to dismiss:', getApiErrorMessage(error));
      addToast(getApiErrorMessage(error), 'error');
    },
  });
}

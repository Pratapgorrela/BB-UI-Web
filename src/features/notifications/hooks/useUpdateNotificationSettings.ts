import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNotificationSettings } from '../api/notificationApi';
import { notificationKeys } from './keys';
import { useToast } from '../../../components/ui';
import { getApiErrorMessage } from '../../../utils/apiError';
import type { NotificationSettings, UpdateNotificationSettingsRequest } from '../types/notification';

/**
 * Update notification preferences. Optimistic — a toggle flips instantly and
 * rolls back on failure (the settings query is the single source of truth).
 */
export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: updateNotificationSettings,
    onMutate: async (patch: UpdateNotificationSettingsRequest) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.settings() });
      const previous = queryClient.getQueryData<NotificationSettings>(notificationKeys.settings());
      if (previous) {
        queryClient.setQueryData<NotificationSettings>(notificationKeys.settings(), {
          ...previous,
          ...patch,
        });
      }
      return { previous };
    },
    onError: (error, _patch, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationKeys.settings(), context.previous);
      }
      console.error('[Notifications] Failed to update settings:', getApiErrorMessage(error));
      addToast(getApiErrorMessage(error), 'error');
    },
    onSuccess: (settings) => {
      queryClient.setQueryData(notificationKeys.settings(), settings);
      console.log('[Notifications] Settings updated');
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.settings() });
    },
  });
}

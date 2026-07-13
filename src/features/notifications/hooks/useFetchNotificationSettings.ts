import { useQuery } from '@tanstack/react-query';
import { fetchNotificationSettings } from '../api/notificationApi';
import { notificationKeys } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';

/** The caller's notification preferences (WhatsApp opt-in + 4 channel toggles). */
export function useFetchNotificationSettings() {
  return useQuery({
    queryKey: notificationKeys.settings(),
    queryFn: async () => {
      try {
        return await fetchNotificationSettings();
      } catch (error) {
        console.error('[Notifications] Failed to fetch settings:', getApiErrorMessage(error));
        throw error;
      }
    },
    retry: false,
  });
}

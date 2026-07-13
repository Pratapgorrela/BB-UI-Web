import { useQuery } from '@tanstack/react-query';
import { fetchTimeSlots } from '../api/bookingApi';
import { bookingKeys, SLOTS_STALE_TIME_MS } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';

/** Arrival windows for a `YYYY-MM-DD` date. Disabled until a date is set. */
export function useFetchTimeSlots(date: string | null) {
  return useQuery({
    enabled: !!date,
    queryKey: bookingKeys.slots(date ?? ''),
    queryFn: async () => {
      try {
        return await fetchTimeSlots(date!);
      } catch (error) {
        console.error('[Booking] Failed to fetch time slots:', getApiErrorMessage(error));
        throw error;
      }
    },
    staleTime: SLOTS_STALE_TIME_MS,
    retry: false,
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rescheduleBooking } from '../api/bookingApi';
import { bookingKeys } from './keys';
import { formatScheduledAt } from '../utils/slotFormat';
import { useToast } from '../../../components/ui';
import { getApiErrorMessage } from '../../../utils/apiError';
import type { RescheduleBookingRequest } from '../types/booking';

/** 409 SLOT_UNAVAILABLE recovery (refetch + reopen picker) is owned by the page. */
export function useRescheduleBooking() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ id, ...request }: RescheduleBookingRequest & { id: string }) =>
      rescheduleBooking(id, request),
    onSuccess: (booking) => {
      // bookingKeys.all also covers slot queries, so the freed/taken windows refresh.
      void queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      addToast(`Rescheduled to ${formatScheduledAt(booking.scheduledAt)}`, 'success');
      console.log('[Booking] Booking rescheduled:', booking.referenceCode);
    },
    onError: (error) => {
      console.error('[Booking] Failed to reschedule booking:', getApiErrorMessage(error));
      addToast(getApiErrorMessage(error), 'error');
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelBooking } from '../api/bookingApi';
import { bookingKeys } from './keys';
import { useToast } from '../../../components/ui';
import { getApiErrorMessage } from '../../../utils/apiError';
import type { CancelBookingRequest } from '../types/booking';

export function useCancelBooking() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ id, ...request }: CancelBookingRequest & { id: string }) =>
      cancelBooking(id, request),
    onSuccess: (booking) => {
      void queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      addToast('Booking cancelled.', 'success');
      console.log('[Booking] Booking cancelled:', booking.referenceCode);
    },
    onError: (error) => {
      console.error('[Booking] Failed to cancel booking:', getApiErrorMessage(error));
      addToast(getApiErrorMessage(error), 'error');
    },
  });
}

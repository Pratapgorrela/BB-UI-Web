import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking } from '../api/bookingApi';
import { bookingKeys } from './keys';
import { cartKeys } from '../../cart/hooks/keys';
import { useCartStore } from '../../../store/useCartStore';
import { useToast } from '../../../components/ui';
import { getApiErrorMessage } from '../../../utils/apiError';

export function useCreateBooking() {
  const clearCart = useCartStore((state) => state.clearCart);
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (booking) => {
      clearCart();
      void queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      void queryClient.invalidateQueries({ queryKey: cartKeys.all });
      addToast(`Booking placed — ${booking.referenceCode}`, 'success');
      console.log('[Booking] Booking placed:', booking.referenceCode);
    },
    onError: (error) => {
      console.error('[Booking] Failed to place booking:', getApiErrorMessage(error));
      addToast(getApiErrorMessage(error), 'error');
    },
  });
}

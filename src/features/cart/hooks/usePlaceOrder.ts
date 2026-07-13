import { useMutation, useQueryClient } from '@tanstack/react-query';
import { placeOrder } from '../api/cartApi';
import { cartKeys } from './keys';
import { useCartStore } from '../../../store/useCartStore';
import { useToast } from '../../../components/ui';
import { getApiErrorMessage } from '../../../utils/apiError';

export function usePlaceOrder() {
  const clearCart = useCartStore((state) => state.clearCart);
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: placeOrder,
    onSuccess: (order) => {
      clearCart();
      void queryClient.invalidateQueries({ queryKey: cartKeys.all });
      addToast(`Order placed — ${order.referenceCode}`, 'success');
      console.log('[Cart] Order placed:', order.referenceCode);
    },
    onError: (error) => {
      console.error('[Cart] Failed to place order:', getApiErrorMessage(error));
      addToast(getApiErrorMessage(error), 'error');
    },
  });
}

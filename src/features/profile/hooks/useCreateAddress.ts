import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAddress } from '../api/profileApi';
import { addressKeys } from './keys';
import { useToast } from '../../../components/ui';
import { getApiErrorMessage } from '../../../utils/apiError';

export function useCreateAddress() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: createAddress,
    onSuccess: (address) => {
      void queryClient.invalidateQueries({ queryKey: addressKeys.all });
      addToast('Address added.', 'success');
      console.log('[Profile] Address added:', address.id);
    },
    onError: (error) => {
      console.error('[Profile] Failed to add address:', getApiErrorMessage(error));
      addToast(getApiErrorMessage(error), 'error');
    },
  });
}

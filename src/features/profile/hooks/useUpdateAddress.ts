import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAddress } from '../api/profileApi';
import { addressKeys } from './keys';
import { useToast } from '../../../components/ui';
import { getApiErrorMessage } from '../../../utils/apiError';
import type { UpdateAddressRequest } from '../types/address';

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateAddressRequest & { id: string }) =>
      updateAddress(id, payload),
    onSuccess: (address) => {
      void queryClient.invalidateQueries({ queryKey: addressKeys.all });
      addToast('Address updated.', 'success');
      console.log('[Profile] Address updated:', address.id);
    },
    onError: (error) => {
      console.error('[Profile] Failed to update address:', getApiErrorMessage(error));
      addToast(getApiErrorMessage(error), 'error');
    },
  });
}

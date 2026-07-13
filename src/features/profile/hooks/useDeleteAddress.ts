import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAddress } from '../api/profileApi';
import { addressKeys } from './keys';
import { useToast } from '../../../components/ui';
import { getApiErrorMessage } from '../../../utils/apiError';

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: addressKeys.all });
      addToast('Address removed.', 'success');
      console.log('[Profile] Address removed:', id);
    },
    onError: (error) => {
      console.error('[Profile] Failed to remove address:', getApiErrorMessage(error));
      addToast(getApiErrorMessage(error), 'error');
    },
  });
}

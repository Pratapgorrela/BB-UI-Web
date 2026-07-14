import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSupportRequest } from '../api/supportApi';
import { supportKeys } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';

/**
 * Raise a concern. No toast here — the page renders explicit success/failure
 * result states per the Figma flow, so feedback lives in the UI, not a toast.
 */
export function useCreateSupportRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSupportRequest,
    onSuccess: (request) => {
      console.log('[Support] Request created:', request.referenceCode);
      void queryClient.invalidateQueries({ queryKey: supportKeys.requests() });
    },
    onError: (error) => {
      console.error('[Support] Failed to create request:', getApiErrorMessage(error));
    },
  });
}

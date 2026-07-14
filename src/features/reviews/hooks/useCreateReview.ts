import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview } from '../api/reviewsApi';
import { reviewKeys } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';

/**
 * Creates a review for a completed booking. Success/error feedback (toasts,
 * 409 handling) lives at the page/modal level per the app convention.
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: (review) => {
      console.log('[Reviews] Review created:', review.id);
      void queryClient.invalidateQueries({ queryKey: reviewKeys.service(review.serviceId) });
    },
    onError: (error) => {
      console.error('[Reviews] Failed to create review:', getApiErrorMessage(error));
    },
  });
}

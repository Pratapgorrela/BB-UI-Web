import { useQuery } from '@tanstack/react-query';
import { fetchFaqs } from '../api/supportApi';
import { FAQS_STALE_TIME_MS, supportKeys } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';

/** The Help & Support FAQ list (guest-readable, `sortOrder` ASC). */
export function useFetchFaqs() {
  return useQuery({
    queryKey: supportKeys.faqs(),
    queryFn: async () => {
      try {
        return await fetchFaqs();
      } catch (error) {
        console.error('[Support] Failed to fetch FAQs:', getApiErrorMessage(error));
        throw error;
      }
    },
    staleTime: FAQS_STALE_TIME_MS,
    retry: false,
  });
}

import { useQuery } from '@tanstack/react-query';
import { fetchTestimonials } from '../api/homeApi';
import { HOME_STALE_TIME_MS, homeKeys } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';

export function useFetchTestimonials() {
  return useQuery({
    queryKey: homeKeys.testimonials(),
    queryFn: async () => {
      try {
        return await fetchTestimonials();
      } catch (error) {
        console.error(
          '[HomeTestimonials] Failed to fetch testimonials:',
          getApiErrorMessage(error),
        );
        throw error;
      }
    },
    staleTime: HOME_STALE_TIME_MS,
  });
}

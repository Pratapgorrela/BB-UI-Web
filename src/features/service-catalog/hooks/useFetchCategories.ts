import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../api/catalogApi';
import { CATALOG_STALE_TIME_MS, catalogKeys } from './keys';
import { getApiErrorMessage } from '../../../utils/apiError';

export function useFetchCategories() {
  return useQuery({
    queryKey: catalogKeys.categories(),
    queryFn: async () => {
      try {
        return await fetchCategories();
      } catch (error) {
        console.error('[Catalog] Failed to fetch categories:', getApiErrorMessage(error));
        throw error;
      }
    },
    staleTime: CATALOG_STALE_TIME_MS,
  });
}

import { useQuery } from '@tanstack/react-query';
import { fetchAddresses } from '../api/profileApi';
import { addressKeys } from './keys';

export function useFetchAddresses() {
  return useQuery({
    queryKey: addressKeys.list(),
    queryFn: fetchAddresses,
  });
}

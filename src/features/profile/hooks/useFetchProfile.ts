import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '../api/profileApi';
import { profileKeys } from './keys';

export function useFetchProfile() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: fetchProfile,
  });
}

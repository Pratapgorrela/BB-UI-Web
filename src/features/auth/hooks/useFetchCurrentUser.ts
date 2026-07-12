import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '../api/authApi';
import { authKeys } from './keys';
import { useAuthStore } from '../../../store/useAuthStore';

export function useFetchCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: fetchCurrentUser,
    enabled: isAuthenticated,
  });
}

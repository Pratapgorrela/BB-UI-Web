import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutUser } from '../api/authApi';
import { authKeys } from './keys';
import { useAuthStore } from '../../../store/useAuthStore';
import { useToast } from '../../../components/ui';

export function useLogoutUser() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: logoutUser,
    // Clear the local session even if the API call fails — the user asked to leave.
    onSettled: () => {
      clearSession();
      queryClient.removeQueries({ queryKey: authKeys.all });
      addToast('You have been logged out', 'info');
      console.log('[Auth] Session cleared');
    },
  });
}

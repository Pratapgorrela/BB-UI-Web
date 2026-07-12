import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/authApi';
import { useAuthStore } from '../../../store/useAuthStore';
import { useToast } from '../../../components/ui';
import { getApiErrorMessage } from '../../../utils/apiError';

export function useLoginUser() {
  const setSession = useAuthStore((state) => state.setSession);
  const { addToast } = useToast();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (session) => {
      setSession(session);
      addToast(`Welcome back, ${session.user.firstName}`, 'success');
      console.log('[Auth] Login successful for:', session.user.email);
    },
    onError: (error) => {
      console.error('[Auth] Login failed:', getApiErrorMessage(error));
    },
  });
}

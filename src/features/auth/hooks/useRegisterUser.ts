import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/authApi';
import { useAuthStore } from '../../../store/useAuthStore';
import { useToast } from '../../../components/ui';
import { getApiErrorMessage } from '../../../utils/apiError';

export function useRegisterUser() {
  const setSession = useAuthStore((state) => state.setSession);
  const { addToast } = useToast();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (session) => {
      setSession(session);
      addToast(`Welcome to Beauty Bus, ${session.user.firstName}`, 'success');
      console.log('[Auth] Registration successful for:', session.user.email);
    },
    onError: (error) => {
      console.error('[Auth] Registration failed:', getApiErrorMessage(error));
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../api/profileApi';
import { profileKeys } from './keys';
import { useAuthStore } from '../../../store/useAuthStore';
import { useToast } from '../../../components/ui';
import { getApiErrorMessage } from '../../../utils/apiError';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const { addToast } = useToast();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      // Keep global UI (TopNav, home greeting) in sync with the edit.
      setUser(user);
      queryClient.setQueryData(profileKeys.me(), user);
      void queryClient.invalidateQueries({ queryKey: profileKeys.all });
      addToast('Profile updated.', 'success');
      console.log('[Profile] Profile updated:', user.id);
    },
    onError: (error) => {
      console.error('[Profile] Failed to update profile:', getApiErrorMessage(error));
      addToast(getApiErrorMessage(error), 'error');
    },
  });
}

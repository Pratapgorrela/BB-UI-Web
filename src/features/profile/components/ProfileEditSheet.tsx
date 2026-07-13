import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Modal, TextInput } from '../../../components/ui';
import { profileFormSchema } from '../types/address.schema';
import type { ProfileFormValues } from '../types/address.schema';
import type { User } from '../../auth/types/auth';

interface ProfileEditSheetProps {
  open: boolean;
  onClose: () => void;
  user: Pick<User, 'firstName' | 'lastName' | 'phone' | 'email'>;
  onSubmit: (values: ProfileFormValues) => void;
  isPending: boolean;
}

function ProfileEditSheet({ open, onClose, user, onSubmit, isPending }: ProfileEditSheetProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({ resolver: zodResolver(profileFormSchema) });

  // Reset to the current profile every time the sheet opens.
  useEffect(() => {
    if (open) {
      reset({ firstName: user.firstName, lastName: user.lastName, phone: user.phone });
    }
  }, [open, user.firstName, user.lastName, user.phone, reset]);

  const submit = handleSubmit((values) => onSubmit(values));

  return (
    <Modal open={open} onClose={onClose} title="Edit profile">
      <form onSubmit={(event) => void submit(event)} noValidate className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput
            label="First name"
            autoComplete="given-name"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <TextInput
            label="Last name"
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <TextInput
          label="Phone"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+919876543210"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <TextInput
          label="Email"
          value={user.email}
          disabled
          helperText="Email can't be changed."
          readOnly
        />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export { ProfileEditSheet };
export type { ProfileEditSheetProps };

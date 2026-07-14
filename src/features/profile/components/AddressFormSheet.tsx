import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Modal, TextInput, Toggle } from '../../../components/ui';
import { addressFormSchema } from '../types/address.schema';
import type { AddressFormValues } from '../types/address.schema';
import type { Address, CreateAddressRequest } from '../types/address';

interface AddressFormSheetProps {
  open: boolean;
  onClose: () => void;
  /** The address being edited, or null when adding a new one. */
  address: Address | null;
  onSubmit: (payload: CreateAddressRequest) => void;
  isPending: boolean;
}

const emptyValues: AddressFormValues = {
  label: '',
  street: '',
  apartment: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'IN',
  isDefault: false,
};

function toFormValues(address: Address): AddressFormValues {
  return {
    label: address.label,
    street: address.street,
    apartment: address.apartment ?? '',
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    country: address.country,
    isDefault: address.isDefault,
  };
}

function AddressFormSheet({ open, onClose, address, onSubmit, isPending }: AddressFormSheetProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<AddressFormValues>({ resolver: zodResolver(addressFormSchema), defaultValues: emptyValues });

  const isEditing = address !== null;
  // The default address can't be un-defaulted here (there must always be one).
  const lockDefault = isEditing && address.isDefault;
  // useWatch instead of watch(): memoization-safe subscription (React Compiler lint).
  const isDefault = useWatch({ control, name: 'isDefault' });

  useEffect(() => {
    if (open) reset(address ? toFormValues(address) : emptyValues);
  }, [open, address, reset]);

  const submit = handleSubmit((values) => {
    const payload: CreateAddressRequest = {
      label: values.label.trim(),
      street: values.street.trim(),
      apartment: values.apartment.trim() ? values.apartment.trim() : null,
      city: values.city.trim(),
      state: values.state.trim(),
      zipCode: values.zipCode.trim(),
      country: values.country.trim().toUpperCase(),
      isDefault: values.isDefault,
    };
    onSubmit(payload);
  });

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Edit address' : 'Add address'}>
      <form onSubmit={(event) => void submit(event)} noValidate className="flex flex-col gap-4">
        <TextInput
          label="Label"
          placeholder="Home, Office…"
          error={errors.label?.message}
          {...register('label')}
        />
        <TextInput
          label="Street address"
          autoComplete="address-line1"
          error={errors.street?.message}
          {...register('street')}
        />
        <TextInput
          label="Apartment / floor (optional)"
          autoComplete="address-line2"
          error={errors.apartment?.message}
          {...register('apartment')}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput
            label="City"
            autoComplete="address-level2"
            error={errors.city?.message}
            {...register('city')}
          />
          <TextInput
            label="State"
            autoComplete="address-level1"
            error={errors.state?.message}
            {...register('state')}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput
            label="PIN code"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="500033"
            error={errors.zipCode?.message}
            {...register('zipCode')}
          />
          <TextInput
            label="Country"
            autoComplete="country"
            error={errors.country?.message}
            {...register('country')}
          />
        </div>

        <Toggle
          label="Set as default address"
          description={
            lockDefault
              ? 'This is your default address.'
              : 'Use this address by default at checkout.'
          }
          checked={isDefault}
          disabled={lockDefault}
          onChange={(next) => setValue('isDefault', next)}
        />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            {isEditing ? 'Save address' : 'Add address'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export { AddressFormSheet };
export type { AddressFormSheetProps };

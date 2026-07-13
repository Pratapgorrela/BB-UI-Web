import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Button, Modal, Textarea } from '../../../components/ui';
import { cancelBookingFormSchema } from '../types/booking.schema';
import { formatScheduledAt } from '../utils/slotFormat';
import type { Booking } from '../types/booking';

type CancelFormValues = z.infer<typeof cancelBookingFormSchema>;

interface CancelBookingModalProps {
  open: boolean;
  onClose: () => void;
  booking: Pick<Booking, 'scheduledAt'>;
  onConfirm: (cancellationReason: string) => void;
  isPending: boolean;
}

function CancelBookingModal({
  open,
  onClose,
  booking,
  onConfirm,
  isPending,
}: CancelBookingModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CancelFormValues>({ resolver: zodResolver(cancelBookingFormSchema) });

  // Fresh form every time the modal opens.
  useEffect(() => {
    if (open) reset({ cancellationReason: '' });
  }, [open, reset]);

  const onSubmit = handleSubmit((values) => onConfirm(values.cancellationReason));

  return (
    <Modal open={open} onClose={onClose} title="Cancel booking?">
      <form onSubmit={(event) => void onSubmit(event)} noValidate className="flex flex-col gap-4">
        <p className="text-body-sm text-neutral-600">
          Your appointment on{' '}
          <span className="font-semibold text-neutral-900">
            {formatScheduledAt(booking.scheduledAt)}
          </span>{' '}
          will be cancelled. Free cancellation up to 2 hours before your slot.
        </p>

        <Textarea
          label="Reason for cancelling"
          placeholder="Tell us why you're cancelling"
          rows={3}
          error={errors.cancellationReason?.message}
          {...register('cancellationReason')}
        />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Keep booking
          </Button>
          <Button type="submit" variant="danger" loading={isPending}>
            Cancel booking
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export { CancelBookingModal };
export type { CancelBookingModalProps };

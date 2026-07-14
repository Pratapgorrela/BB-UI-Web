import { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Button, Modal, Select, StarRating, Textarea, useToast } from '../../../components/ui';
import { writeReviewFormSchema } from '../types/review.schema';
import { useCreateReview } from '../hooks/useCreateReview';
import { getApiError, getApiErrorMessage } from '../../../utils/apiError';

type WriteReviewFormValues = z.infer<typeof writeReviewFormSchema>;

/** A reviewable service from the booking's items. */
interface ReviewableService {
  id: string;
  name: string;
}

interface WriteReviewModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  services: ReviewableService[];
}

/**
 * Review form for a completed booking. Multi-service bookings pick which
 * service the review is about (contract: one review per booking). A 409
 * CONFLICT means the booking is already reviewed; server failures keep the
 * form intact for retry.
 */
function WriteReviewModal({ open, onClose, bookingId, services }: WriteReviewModalProps) {
  const { addToast } = useToast();
  const createReview = useCreateReview();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WriteReviewFormValues>({
    resolver: zodResolver(writeReviewFormSchema),
    defaultValues: { serviceId: services[0]?.id ?? '', rating: 0, comment: '' },
  });

  // Fresh form every time the modal opens. Reset only on the closed→open
  // transition — `services` is rebuilt by the parent on every render, so
  // resetting whenever it changes would wipe in-progress input (e.g. after a
  // failed submit re-renders the page).
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open && !wasOpen.current) {
      reset({ serviceId: services[0]?.id ?? '', rating: 0, comment: '' });
    }
    wasOpen.current = open;
  }, [open, reset, services]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createReview.mutateAsync({ bookingId, ...values });
      addToast('Thanks! Your review has been published.', 'success');
      onClose();
    } catch (error) {
      if (getApiError(error)?.code === 'CONFLICT') {
        addToast("You've already reviewed this booking.", 'info');
        onClose();
        return;
      }
      // Validation/server errors: surface the message, keep the form intact.
      addToast(getApiErrorMessage(error), 'error');
    }
  });

  return (
    <Modal open={open} onClose={onClose} title="Write a review">
      <form onSubmit={(event) => void onSubmit(event)} noValidate className="flex flex-col gap-4">
        {services.length > 1 && (
          <Select
            label="Which service is this review about?"
            options={services.map((service) => ({ value: service.id, label: service.name }))}
            error={errors.serviceId?.message}
            {...register('serviceId')}
          />
        )}

        <div>
          <p className="mb-1 text-body-sm font-medium text-neutral-700">Your rating</p>
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <StarRating value={field.value} onChange={field.onChange} label="Your rating" />
            )}
          />
          {errors.rating && (
            <p role="alert" className="mt-1 text-caption text-danger-600">
              {errors.rating.message}
            </p>
          )}
        </div>

        <Textarea
          label="Your review"
          placeholder="How was the service, the specialist, the experience?"
          rows={4}
          error={errors.comment?.message}
          {...register('comment')}
        />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose} disabled={createReview.isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={createReview.isPending}>
            Submit review
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export { WriteReviewModal };
export type { ReviewableService, WriteReviewModalProps };

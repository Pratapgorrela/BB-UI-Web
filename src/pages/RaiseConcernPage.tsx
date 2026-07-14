import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button, Card, Select, Textarea } from '../components/ui';
import { PageHeader } from '../components/layout';
import { useFetchBookings, formatScheduledAt } from '../features/booking';
import {
  NO_BOOKING_VALUE,
  raiseConcernFormSchema,
  SUPPORT_ISSUE_TYPE_OPTIONS,
  useCreateSupportRequest,
} from '../features/support';
import type { SupportRequest } from '../features/support';
import { getApiErrorMessage } from '../utils/apiError';

/** Field values as typed (issueType allows '' for the placeholder) vs. as validated. */
type ConcernFormInput = z.input<typeof raiseConcernFormSchema>;
type ConcernFormOutput = z.output<typeof raiseConcernFormSchema>;

type Phase = 'form' | 'success' | 'failure';

/** Submission success state (Figma 184:7597). */
function SuccessResult({ request, onDone }: { request: SupportRequest; onDone: () => void }) {
  const navigate = useNavigate();
  return (
    <Card variant="raised" padding="lg" className="flex flex-col items-center gap-4 text-center">
      <CheckCircle2 size={56} className="text-success-500" aria-hidden="true" />
      <div>
        <h2 className="font-heading text-h4 font-semibold text-neutral-800">Request submitted</h2>
        <p className="mt-1 text-body-sm text-neutral-600">
          Our care team will get back to you within 24 hours. Your reference is{' '}
          <span className="font-mono font-medium text-neutral-800">{request.referenceCode}</span>.
        </p>
      </div>
      <div className="flex w-full flex-col gap-2">
        <Button variant="primary" fullWidth onClick={() => navigate('/help/requests')}>
          View your requests
        </Button>
        <Button variant="ghost" fullWidth onClick={onDone}>
          Back to help
        </Button>
      </div>
    </Card>
  );
}

/** Submission failure state (Figma 184:7607) — Try again returns to the intact form. */
function FailureResult({ message, onRetry }: { message: string; onRetry: () => void }) {
  const navigate = useNavigate();
  return (
    <Card variant="raised" padding="lg" className="flex flex-col items-center gap-4 text-center">
      <XCircle size={56} className="text-danger-500" aria-hidden="true" />
      <div>
        <h2 className="font-heading text-h4 font-semibold text-neutral-800">
          Submission failed
        </h2>
        <p className="mt-1 text-body-sm text-neutral-600">{message}</p>
      </div>
      <div className="flex w-full flex-col gap-2">
        <Button variant="primary" fullWidth onClick={onRetry}>
          Try again
        </Button>
        <Button variant="ghost" fullWidth onClick={() => navigate('/help')}>
          Back to help
        </Button>
      </div>
    </Card>
  );
}

export function Component() {
  const navigate = useNavigate();
  const bookings = useFetchBookings({ limit: 50 });
  const createRequest = useCreateSupportRequest();

  const [phase, setPhase] = useState<Phase>('form');
  const [created, setCreated] = useState<SupportRequest | null>(null);
  const [failureMessage, setFailureMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConcernFormInput, unknown, ConcernFormOutput>({
    resolver: zodResolver(raiseConcernFormSchema),
    defaultValues: { bookingId: NO_BOOKING_VALUE, issueType: '', description: '' },
  });

  // RHF keeps values while result views replace the fields, so Try again
  // returns to the form exactly as the user left it.
  const onSubmit = handleSubmit((values) => {
    createRequest.mutate(
      {
        bookingId: values.bookingId === NO_BOOKING_VALUE ? null : values.bookingId,
        issueType: values.issueType,
        description: values.description,
      },
      {
        onSuccess: (request) => {
          setCreated(request);
          setPhase('success');
        },
        onError: (error) => {
          setFailureMessage(getApiErrorMessage(error));
          setPhase('failure');
        },
      },
    );
  });

  const bookingOptions = [
    { value: NO_BOOKING_VALUE, label: 'Not related to a booking' },
    ...(bookings.data?.bookings ?? []).map((booking) => ({
      value: booking.id,
      label: `${booking.referenceCode} — ${formatScheduledAt(booking.scheduledAt)}`,
    })),
  ];

  return (
    <div className="pb-6">
      <PageHeader title="Raise a concern" backTo="/help" />

      <div className="max-w-xl">
        {phase === 'success' && created ? (
          <SuccessResult request={created} onDone={() => navigate('/help')} />
        ) : phase === 'failure' ? (
          <FailureResult message={failureMessage} onRetry={() => setPhase('form')} />
        ) : (
          <Card variant="default" padding="lg">
            <form onSubmit={(event) => void onSubmit(event)} noValidate className="flex flex-col gap-4">
              <p className="text-body-sm text-neutral-600">
                Tell us what went wrong and we&rsquo;ll make it right. Link a booking if your
                concern is about a specific appointment.
              </p>

              <Select
                label="Booking"
                options={bookingOptions}
                helperText={
                  bookings.isLoading
                    ? 'Loading your bookings…'
                    : bookings.error
                      ? 'Couldn’t load your bookings — you can still submit without one.'
                      : undefined
                }
                error={errors.bookingId?.message}
                {...register('bookingId')}
              />

              <Select
                label="Issue type"
                placeholder="Select issue type"
                options={SUPPORT_ISSUE_TYPE_OPTIONS}
                error={errors.issueType?.message}
                {...register('issueType')}
              />

              <Textarea
                label="Description"
                placeholder="Describe the issue — what happened, and when?"
                rows={5}
                helperText="At least 20 characters"
                error={errors.description?.message}
                {...register('description')}
              />

              <Button type="submit" variant="primary" fullWidth loading={createRequest.isPending}>
                Submit request
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}

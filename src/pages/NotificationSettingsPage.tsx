import { MessageCircle } from 'lucide-react';
import { Card, DataState, Toggle } from '../components/ui';
import { PageHeader } from '../components/layout';
import {
  useFetchNotificationSettings,
  useUpdateNotificationSettings,
} from '../features/notifications';
import type {
  NotificationSettings,
  UpdateNotificationSettingsRequest,
} from '../features/notifications';

interface ChannelRow {
  key: keyof Pick<
    NotificationSettings,
    'bookingUpdates' | 'servicePromotions' | 'referralRewards' | 'feedbackRequests'
  >;
  label: string;
  description: string;
}

const CHANNELS: ChannelRow[] = [
  {
    key: 'bookingUpdates',
    label: 'Booking updates',
    description: 'Confirmations, reminders, and changes to your appointments.',
  },
  {
    key: 'servicePromotions',
    label: 'Service promotions',
    description: 'Offers, discounts, and seasonal deals.',
  },
  {
    key: 'referralRewards',
    label: 'Referral rewards',
    description: 'Updates when your referrals earn you rewards.',
  },
  {
    key: 'feedbackRequests',
    label: 'Feedback requests',
    description: 'Requests to review a completed service.',
  },
];

export function Component() {
  const query = useFetchNotificationSettings();
  const update = useUpdateNotificationSettings();

  function toggle(patch: UpdateNotificationSettingsRequest) {
    update.mutate(patch);
  }

  return (
    <div className="flex flex-col gap-4 py-2">
      <PageHeader title="Notification settings" backTo="/notifications" />

      <DataState<NotificationSettings>
        data={query.data}
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={() => false}
        onRetry={() => void query.refetch()}
        skeletonCount={2}
      >
        {(settings) => (
          <div className="flex flex-col gap-6">
            {/* WhatsApp opt-in */}
            <Card className="flex items-center gap-3">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success-100 text-success-600"
                aria-hidden="true"
              >
                <MessageCircle size={20} />
              </span>
              <Toggle
                className="flex-1"
                checked={settings.whatsappEnabled}
                onChange={(value) => toggle({ whatsappEnabled: value })}
                label="Connect on WhatsApp"
                description="Get booking updates on WhatsApp."
              />
            </Card>

            {/* Channel toggles */}
            <section className="flex flex-col gap-1">
              <h2 className="px-1 text-body-sm font-semibold text-neutral-500">Notify me about</h2>
              <Card padding="none" className="divide-y divide-neutral-200">
                {CHANNELS.map((channel) => (
                  <Toggle
                    key={channel.key}
                    className="p-4"
                    checked={settings[channel.key]}
                    onChange={(value) => toggle({ [channel.key]: value })}
                    label={channel.label}
                    description={channel.description}
                  />
                ))}
              </Card>
            </section>
          </div>
        )}
      </DataState>
    </div>
  );
}

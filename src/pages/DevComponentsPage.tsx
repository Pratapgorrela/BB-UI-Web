import { useState } from 'react';
import { Search, Mail, Eye } from 'lucide-react';
import {
  Button,
  TextInput,
  Select,
  Textarea,
  Card,
  Badge,
  DiscountBadge,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  Avatar,
  Modal,
  ToastProvider,
  Toggle,
  Accordion,
  StickyBottomBar,
  DataState,
} from '../components/ui';
import { ToastDemo } from './dev/ToastDemo';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-h2 font-heading font-semibold text-neutral-800 border-b border-neutral-300 pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Component() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toggleA, setToggleA] = useState(true);
  const [toggleB, setToggleB] = useState(false);

  return (
    <ToastProvider>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-12 pb-24">
        <h1 className="text-h1 font-heading font-bold text-neutral-900">
          Design System — Components
        </h1>

        {/* ── Buttons ── */}
        <Section title="Button">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button leftIcon={<Search size={18} />}>With icon</Button>
            <Button variant="outline" fullWidth>Full width</Button>
          </div>
        </Section>

        {/* ── Inputs ── */}
        <Section title="Input">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Email" placeholder="you@example.com" leftIcon={<Mail size={18} />} />
            <TextInput label="Password" type="password" placeholder="Enter password" rightIcon={<Eye size={18} />} />
            <TextInput label="With error" error="This field is required" placeholder="Type here..." />
            <TextInput label="Disabled" disabled placeholder="Cannot edit" />
          </div>
          <Select
            label="Category"
            placeholder="Choose a category"
            options={[
              { value: 'men', label: 'Men' },
              { value: 'women', label: 'Women' },
              { value: 'kids', label: 'Kids' },
            ]}
          />
          <Textarea
            label="Description"
            placeholder="Tell us more..."
            helperText="Max 500 characters"
          />
        </Section>

        {/* ── Card ── */}
        <Section title="Card">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card variant="default"><p className="text-body-sm">Default card</p></Card>
            <Card variant="raised"><p className="text-body-sm">Raised card</p></Card>
            <Card variant="interactive"><p className="text-body-sm">Interactive card (hover me)</p></Card>
          </div>
        </Section>

        {/* ── Badge ── */}
        <Section title="Badge">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
            <DiscountBadge percentage={20} />
          </div>
        </Section>

        {/* ── Skeleton ── */}
        <Section title="Skeleton">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="text-caption text-neutral-500">Lines</p>
              <SkeletonText lines={3} />
            </div>
            <div className="space-y-3">
              <p className="text-caption text-neutral-500">Circle + Lines</p>
              <div className="flex items-center gap-3">
                <Skeleton variant="circle" width={40} height={40} />
                <SkeletonText lines={2} />
              </div>
            </div>
          </div>
          <SkeletonCard />
        </Section>

        {/* ── Avatar ── */}
        <Section title="Avatar">
          <div className="flex items-center gap-4">
            <Avatar size="sm" name="Neha Sharma" />
            <Avatar size="md" name="Rahul K" />
            <Avatar size="lg" name="Beauty Bus" />
            <Avatar size="lg" src="https://i.pravatar.cc/56" alt="User photo" />
          </div>
        </Section>

        {/* ── Toggle ── */}
        <Section title="Toggle">
          <div className="max-w-sm space-y-4">
            <Toggle
              checked={toggleA}
              onChange={setToggleA}
              label="Booking Updates"
              description="Reminders and changes to your appointments"
            />
            <Toggle
              checked={toggleB}
              onChange={setToggleB}
              label="Service Promotions"
              description="Exclusive offers and discounts"
            />
            <Toggle checked={false} onChange={() => {}} label="Disabled toggle" disabled />
          </div>
        </Section>

        {/* ── Accordion ── */}
        <Section title="Accordion">
          <Accordion
            items={[
              { id: '1', title: 'How do I book a service?', content: 'Browse our service catalog, select the services you want, add them to your cart, and proceed to checkout. Choose your preferred date, time, and address.' },
              { id: '2', title: 'Can I reschedule or cancel a booking?', content: 'Yes, you can reschedule or cancel a booking up to 2 hours before the scheduled time. Go to My Bookings and select the booking you want to modify.' },
              { id: '3', title: 'What if the Beauty Bus is late?', content: 'You can track the Beauty Bus in real-time using the Track Van feature. If there are any delays, you will be notified via push notification.' },
            ]}
            defaultOpenId="1"
          />
        </Section>

        {/* ── Modal ── */}
        <Section title="Modal / BottomSheet">
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirm action">
            <p className="text-body text-neutral-600 mb-4">
              Are you sure you want to proceed? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => setModalOpen(false)}>Confirm</Button>
            </div>
          </Modal>
        </Section>

        {/* ── Toast ── */}
        <Section title="Toast">
          <ToastDemo />
        </Section>

        {/* ── DataState ── */}
        <Section title="DataState">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-caption text-neutral-500 mb-2">Loading</p>
              <DataState data={undefined} isLoading={true} error={null} skeletonCount={1}>
                {() => null}
              </DataState>
            </Card>
            <Card>
              <p className="text-caption text-neutral-500 mb-2">Error</p>
              <DataState data={undefined} isLoading={false} error={new Error('Network error')} onRetry={() => {}}>
                {() => null}
              </DataState>
            </Card>
            <Card>
              <p className="text-caption text-neutral-500 mb-2">Empty</p>
              <DataState data={[]} isLoading={false} error={null} emptyMessage="No bookings yet" emptyCta={{ label: 'Browse services', onClick: () => {} }}>
                {() => null}
              </DataState>
            </Card>
          </div>
        </Section>

        {/* ── StickyBottomBar ── */}
        <Section title="StickyBottomBar">
          <p className="text-body-sm text-neutral-500">
            The sticky bar is fixed at the bottom of the viewport.
          </p>
        </Section>

        <StickyBottomBar
          totalPrice={450}
          serviceCount={3}
          duration="1hr - 1hr 30 min"
          onCtaClick={() => alert('Continue clicked')}
        />
      </div>
    </ToastProvider>
  );
}

import { useState, useEffect } from 'react';
import {
  Palette, Type, Ruler, Square, Layers, Zap, MousePointerClick, FormInput,
  CreditCard, Tag, User, ToggleRight, ChevronDown, Loader, PanelTop, Bell,
  Database, PanelBottom, Search, Mail, Eye, ArrowRight, Plus,
  Home, ShoppingBag, Calendar, BellRing, UserCircle,
} from 'lucide-react';
import {
  Button, TextInput, Select, Textarea, Card, Badge, DiscountBadge,
  Skeleton, SkeletonText, SkeletonCard, Avatar, Modal, ToastProvider,
  Toggle, Accordion, StickyBottomBar, DataState,
} from '../components/ui';
import { ToastDemo } from './dev/ToastDemo';
import {
  colorGroups, semanticTokens, typeScale, spacingScale,
  radiiScale, shadowScale, zIndexScale, motionTokens, sidebarSections,
} from './dev/designSystemData';

/* ── Icon Map ── */
const iconMap: Record<string, React.ReactNode> = {
  Palette: <Palette size={18} />, Type: <Type size={18} />, Ruler: <Ruler size={18} />,
  Square: <Square size={18} />, Layers: <Layers size={18} />, Zap: <Zap size={18} />,
  MousePointerClick: <MousePointerClick size={18} />, FormInput: <FormInput size={18} />,
  CreditCard: <CreditCard size={18} />, Tag: <Tag size={18} />, User: <User size={18} />,
  ToggleRight: <ToggleRight size={18} />, ChevronDown: <ChevronDown size={18} />,
  Loader: <Loader size={18} />, PanelTop: <PanelTop size={18} />, Bell: <Bell size={18} />,
  Database: <Database size={18} />, PanelBottom: <PanelBottom size={18} />,
};

/* ── Layout Helpers ── */
function SectionHeader({ id, label, description }: { id: string; label: string; description: string }) {
  return (
    <div id={id} className="scroll-mt-8 pt-10 pb-4 border-b border-neutral-300 mb-6">
      <p className="text-caption font-semibold text-primary-500 tracking-widest uppercase mb-1">
        {label}
      </p>
      <h2 className="text-h2 font-heading font-bold text-neutral-900">{label}</h2>
      <p className="text-body text-neutral-500 mt-1">{description}</p>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-h4 font-heading font-semibold text-neutral-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function TokenRow({ label, value, extra }: { label: string; value: string; extra?: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 border-b border-neutral-200 text-body-sm">
      <span className="font-mono font-medium text-neutral-700">{label}</span>
      <div className="flex items-center gap-3">
        {extra && <span className="text-neutral-500">{extra}</span>}
        <span className="text-neutral-600 font-mono">{value}</span>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export function Component() {
  const [activeSection, setActiveSection] = useState('colors');
  const [modalOpen, setModalOpen] = useState(false);
  const [toggleA, setToggleA] = useState(true);
  const [toggleB, setToggleB] = useState(false);
  const [toggleC, setToggleC] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    );
    sidebarSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        {/* ── Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-neutral-300 bg-neutral-0 sticky top-0 h-screen overflow-y-auto">
          <div className="px-5 py-6 border-b border-neutral-300">
            <p className="text-h4 font-heading font-bold text-primary-600">BEAUTY BUS</p>
            <p className="text-caption font-semibold text-primary-400 tracking-widest uppercase">Design System</p>
          </div>
          <nav className="flex-1 py-3 px-2">
            {sidebarSections.map(({ id, label, icon }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setActiveSection(id)}
                className={[
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-body-sm transition-colors duration-fast',
                  activeSection === id
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800',
                ].join(' ')}
              >
                {iconMap[icon]}
                {label}
              </a>
            ))}
          </nav>
          <div className="px-5 py-4 border-t border-neutral-300">
            <p className="text-caption text-neutral-400">F1 Design System</p>
            <p className="text-caption text-neutral-400">v0.1.0</p>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 max-w-4xl mx-auto px-6 pb-32">
          {/* Hero */}
          <div className="pt-10 pb-6">
            <p className="text-caption font-semibold text-primary-500 tracking-widest uppercase mb-2">
              Beauty Bus &middot; Design System
            </p>
            <h1 className="text-display font-heading font-bold text-neutral-900 leading-display">
              Complete Design System
            </h1>
            <p className="text-body-lg text-neutral-500 mt-3 max-w-2xl">
              Design tokens, typography, spacing, the core component library, feedback overlays,
              and loading states. Built with Tailwind v4, React 19, and TypeScript.
            </p>
          </div>

          {/* ════════════════════ COLORS ════════════════════ */}
          <SectionHeader id="colors" label="Colors" description="Semantic color tokens mapped from the brand palette. Components reference roles, never raw hex." />

          <SubSection title="Raw Palette">
            {colorGroups.map((group) => (
              <div key={group.prefix} className="mb-6">
                <p className="text-body-sm font-semibold text-neutral-700 mb-2">{group.name}</p>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1">
                  {group.shades.map((s) => (
                    <div key={s.shade} className="text-center">
                      <div
                        className="h-12 rounded-md border border-neutral-200 mb-1"
                        style={{ backgroundColor: s.hex }}
                      />
                      <p className="text-[10px] font-mono text-neutral-500">{s.shade}</p>
                      <p className="text-[10px] font-mono text-neutral-400">{s.hex}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </SubSection>

          <SubSection title="Semantic Tokens">
            <div className="bg-neutral-0 rounded-lg border border-neutral-300 overflow-hidden">
              <div className="grid grid-cols-4 px-3 py-2 bg-neutral-100 text-caption font-semibold text-neutral-600 border-b border-neutral-300">
                <span>Token</span><span>Maps to</span><span>Usage</span><span>Preview</span>
              </div>
              {semanticTokens.map((t) => (
                <div key={t.token} className="grid grid-cols-4 items-center px-3 py-2.5 border-b border-neutral-200 text-body-sm">
                  <span className="font-mono text-neutral-700">--{t.token}</span>
                  <span className="font-mono text-neutral-500">{t.value}</span>
                  <span className="text-neutral-500">{t.usage}</span>
                  <div className="h-6 w-12 rounded-sm border border-neutral-200" style={{ backgroundColor: `var(--color-${t.value.replace('-', '-')})` }} />
                </div>
              ))}
            </div>
          </SubSection>

          {/* ════════════════════ TYPOGRAPHY ════════════════════ */}
          <SectionHeader id="typography" label="Typography" description="Three font families with a 10-step type scale. Poppins for headings, Inter for body, JetBrains Mono for data." />

          <SubSection title="Font Families">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { name: 'Poppins', role: 'Headings', class: 'font-heading', sample: 'Beauty Bus' },
                { name: 'Inter', role: 'Body', class: 'font-body', sample: 'Book your favorite services' },
                { name: 'JetBrains Mono', role: 'Data / Prices', class: 'font-mono', sample: 'INR 1,299.00' },
              ].map((f) => (
                <Card key={f.name} variant="raised" padding="md">
                  <p className="text-caption text-neutral-500 mb-1">{f.role}</p>
                  <p className={`text-h3 ${f.class} font-semibold text-neutral-800`}>{f.name}</p>
                  <p className={`text-body mt-2 ${f.class} text-neutral-600`}>{f.sample}</p>
                </Card>
              ))}
            </div>
          </SubSection>

          <SubSection title="Type Scale">
            <div className="bg-neutral-0 rounded-lg border border-neutral-300 overflow-hidden">
              {typeScale.map((t) => (
                <div key={t.name} className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
                  <div className="flex-1">
                    <span className={`${t.class} text-neutral-800`}>
                      {t.name === 'Mono' ? 'INR 1,299' : 'Beauty Bus Services'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-caption text-neutral-500 shrink-0">
                    <span className="font-mono w-16 text-right">{t.size}</span>
                    <span className="w-20">{t.font}</span>
                    <span className="w-8 text-right">{t.weight}</span>
                  </div>
                </div>
              ))}
            </div>
          </SubSection>

          {/* ════════════════════ SPACING ════════════════════ */}
          <SectionHeader id="spacing" label="Spacing" description="4px base unit. All spacing values are multiples of 4." />

          <div className="bg-neutral-0 rounded-lg border border-neutral-300 overflow-hidden">
            {spacingScale.map((s) => (
              <div key={s.name} className="flex items-center gap-4 px-4 py-2.5 border-b border-neutral-200">
                <span className="font-mono text-body-sm text-neutral-700 w-10">{s.name}</span>
                <span className="font-mono text-body-sm text-neutral-500 w-12">{s.value}</span>
                <div className="flex-1 flex items-center">
                  <div className="bg-primary-300 rounded-sm h-4" style={{ width: s.value }} />
                </div>
                <span className="text-caption text-neutral-400">{s.desc}</span>
              </div>
            ))}
          </div>

          {/* ════════════════════ RADII ════════════════════ */}
          <SectionHeader id="radii" label="Corners" description="Border radius tokens from subtle rounding to full circles." />

          <div className="flex flex-wrap gap-6">
            {radiiScale.map((r) => (
              <div key={r.name} className="text-center">
                <div className={`w-20 h-20 bg-primary-200 border-2 border-primary-400 ${r.class}`} />
                <p className="text-body-sm font-mono font-medium text-neutral-700 mt-2">{r.name}</p>
                <p className="text-caption text-neutral-500">{r.value}</p>
                <p className="text-caption text-neutral-400">{r.usage}</p>
              </div>
            ))}
          </div>

          {/* ════════════════════ SHADOWS ════════════════════ */}
          <SectionHeader id="shadows" label="Shadows" description="Purple-tinted shadows for consistent depth perception." />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {shadowScale.map((s) => (
              <div key={s.name} className="text-center">
                <div className={`w-full h-20 bg-neutral-0 rounded-lg ${s.class}`} />
                <p className="text-body-sm font-mono font-medium text-neutral-700 mt-3">{s.name}</p>
                <p className="text-caption text-neutral-400">{s.usage}</p>
              </div>
            ))}
          </div>

          {/* ════════════════════ Z-INDEX ════════════════════ */}
          <SectionHeader id="zindex" label="Z-Index" description="Layering scale for stacking contexts." />

          <div className="bg-neutral-0 rounded-lg border border-neutral-300 overflow-hidden">
            {zIndexScale.map((z) => (
              <TokenRow key={z.name} label={`z-${z.name}`} value={String(z.value)} extra={z.usage} />
            ))}
          </div>

          {/* ════════════════════ MOTION ════════════════════ */}
          <SectionHeader id="motion" label="Motion" description="Duration and easing tokens for consistent animation." />

          <div className="grid gap-4 sm:grid-cols-2">
            {motionTokens.map((m) => (
              <Card key={m.name} variant="raised" padding="md">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-body font-semibold text-neutral-800">{m.name}</span>
                  <Badge variant="primary">{m.duration}</Badge>
                </div>
                <p className="text-caption text-neutral-500 font-mono mb-2">{m.easing}</p>
                <p className="text-body-sm text-neutral-500">{m.usage}</p>
                <div className="mt-3 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full animate-pulse"
                    style={{ width: '60%', animationDuration: m.duration }}
                  />
                </div>
              </Card>
            ))}
          </div>

          {/* ════════════════════ BUTTONS ════════════════════ */}
          <SectionHeader id="buttons" label="Buttons" description="5 variants, 3 sizes, loading and disabled states. Min 44px touch target." />

          <SubSection title="Variants">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </SubSection>

          <SubSection title="Sizes">
            <div className="flex flex-wrap gap-3 items-end">
              <Button size="sm">Small (36px)</Button>
              <Button size="md">Medium (44px)</Button>
              <Button size="lg">Large (48px)</Button>
            </div>
          </SubSection>

          <SubSection title="States & Options">
            <div className="flex flex-wrap gap-3">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button leftIcon={<Search size={18} />}>Left icon</Button>
              <Button rightIcon={<ArrowRight size={18} />}>Right icon</Button>
              <Button leftIcon={<Plus size={18} />} variant="outline">Add service</Button>
            </div>
            <div className="mt-4">
              <Button variant="primary" fullWidth>Full width button</Button>
            </div>
          </SubSection>

          {/* ════════════════════ FORMS ════════════════════ */}
          <SectionHeader id="forms" label="Forms" description="TextInput, Select, and Textarea with labels, helper text, error states, and icon support." />

          <SubSection title="Text Inputs">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput label="Default" placeholder="Type something..." />
              <TextInput label="With left icon" placeholder="Search..." leftIcon={<Search size={18} />} />
              <TextInput label="With right icon" type="password" placeholder="Password" rightIcon={<Eye size={18} />} />
              <TextInput label="With helper" placeholder="you@email.com" helperText="We'll never share your email" leftIcon={<Mail size={18} />} />
              <TextInput label="Error state" error="This field is required" placeholder="Required field" />
              <TextInput label="Disabled" disabled placeholder="Cannot edit" />
            </div>
          </SubSection>

          <SubSection title="Select">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Default select"
                placeholder="Choose option..."
                options={[
                  { value: 'men', label: 'Men' },
                  { value: 'women', label: 'Women' },
                  { value: 'kids', label: 'Kids' },
                  { value: 'seniors', label: 'Seniors' },
                ]}
              />
              <Select
                label="With error"
                error="Please select a category"
                options={[{ value: '', label: 'None selected' }]}
              />
            </div>
          </SubSection>

          <SubSection title="Textarea">
            <div className="grid gap-4 sm:grid-cols-2">
              <Textarea label="Default" placeholder="Write your message..." helperText="Max 500 characters" />
              <Textarea label="With error" error="Description is too short" placeholder="Describe your concern..." />
            </div>
          </SubSection>

          {/* ════════════════════ CARDS ════════════════════ */}
          <SectionHeader id="cards" label="Cards" description="3 variants with configurable padding. 12px border radius." />

          <div className="grid gap-4 sm:grid-cols-3">
            <Card variant="default">
              <p className="text-body-sm font-medium text-neutral-700">Default</p>
              <p className="text-caption text-neutral-500 mt-1">Border, no shadow</p>
            </Card>
            <Card variant="raised">
              <p className="text-body-sm font-medium text-neutral-700">Raised</p>
              <p className="text-caption text-neutral-500 mt-1">Shadow, no border</p>
            </Card>
            <Card variant="interactive">
              <p className="text-body-sm font-medium text-neutral-700">Interactive</p>
              <p className="text-caption text-neutral-500 mt-1">Hover to scale up</p>
            </Card>
          </div>

          {/* ════════════════════ BADGES ════════════════════ */}
          <SectionHeader id="badges" label="Chips & Badges" description="6 color variants plus a specialized discount badge. Pill shape, 12px font." />

          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
            <DiscountBadge percentage={20} />
            <DiscountBadge percentage={50} />
          </div>

          <SubSection title="In Context">
            <Card variant="raised" padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body font-semibold text-neutral-800">Classic Haircut</p>
                  <p className="text-body-sm text-neutral-500">Men &middot; 45 min</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-body-sm line-through text-neutral-400 font-mono">INR 599</span>
                  <span className="text-body font-bold text-neutral-800 font-mono">INR 399</span>
                  <DiscountBadge percentage={33} />
                </div>
              </div>
            </Card>
          </SubSection>

          {/* ════════════════════ AVATARS ════════════════════ */}
          <SectionHeader id="avatars" label="Avatars" description="3 sizes with image support and initials fallback. Primary-100/700 for fallback colors." />

          <div className="flex items-end gap-6">
            {[
              { size: 'sm' as const, name: 'NS', label: '32px' },
              { size: 'md' as const, name: 'Rahul K', label: '40px' },
              { size: 'lg' as const, name: 'Beauty Bus', label: '56px' },
            ].map((a) => (
              <div key={a.size} className="text-center">
                <Avatar size={a.size} name={a.name} />
                <p className="text-caption text-neutral-500 mt-2">{a.size}</p>
                <p className="text-caption text-neutral-400">{a.label}</p>
              </div>
            ))}
            <div className="text-center">
              <Avatar size="lg" src="https://i.pravatar.cc/56?u=beauty" alt="Photo" />
              <p className="text-caption text-neutral-500 mt-2">image</p>
              <p className="text-caption text-neutral-400">with src</p>
            </div>
          </div>

          {/* ════════════════════ TOGGLES ════════════════════ */}
          <SectionHeader id="toggles" label="Toggles" description="Switch component matching Figma notification settings. Purple-500 when active." />

          <Card variant="raised" padding="md">
            <div className="max-w-sm space-y-4 divide-y divide-neutral-200">
              <Toggle checked={toggleA} onChange={setToggleA} label="Booking Updates" description="Reminders and changes to your appointments" />
              <div className="pt-4"><Toggle checked={toggleB} onChange={setToggleB} label="Service Promotions" description="Exclusive offers and discounts" /></div>
              <div className="pt-4"><Toggle checked={toggleC} onChange={setToggleC} label="Referral Rewards" description="Updates on your referral bonuses" /></div>
              <div className="pt-4"><Toggle checked={false} onChange={() => {}} label="Disabled" description="This toggle is disabled" disabled /></div>
            </div>
          </Card>

          {/* ════════════════════ ACCORDION ════════════════════ */}
          <SectionHeader id="accordion" label="Accordion" description="FAQ-style expand/collapse with animated chevron rotation." />

          <Card variant="raised" padding="md">
            <Accordion
              items={[
                { id: '1', title: 'How do I book a service?', content: 'Browse our service catalog, select the services you want, add them to your cart, and proceed to checkout. Choose your preferred date, time, and address for the Beauty Bus to arrive.' },
                { id: '2', title: 'Can I reschedule or cancel a booking?', content: 'Yes, you can reschedule or cancel a booking up to 2 hours before the scheduled time. Go to My Bookings and select the booking you want to modify.' },
                { id: '3', title: 'What if the Beauty Bus is late?', content: 'You can track the Beauty Bus in real-time using the Track Van feature. If there are any delays, you will be notified via push notification and WhatsApp.' },
                { id: '4', title: 'How do I apply a promo code?', content: 'During checkout, you will see an "Offers & Coupons" section. Tap on it to enter your promo code or select from available offers.' },
                { id: '5', title: 'What areas do you serve?', content: 'We currently serve the Hyderabad metropolitan area. Check availability by entering your address during booking.' },
              ]}
              defaultOpenId="1"
            />
          </Card>

          {/* ════════════════════ SKELETON ════════════════════ */}
          <SectionHeader id="skeleton" label="Loading States" description="Skeleton placeholders matching layout shapes. Line, circle, card, and rectangle variants." />

          <div className="grid gap-6 sm:grid-cols-2">
            <Card variant="raised" padding="md">
              <p className="text-caption font-semibold text-neutral-500 mb-3">Text lines</p>
              <SkeletonText lines={4} />
            </Card>
            <Card variant="raised" padding="md">
              <p className="text-caption font-semibold text-neutral-500 mb-3">Profile row</p>
              <div className="flex items-center gap-3">
                <Skeleton variant="circle" width={48} height={48} />
                <div className="flex-1">
                  <SkeletonText lines={2} />
                </div>
              </div>
            </Card>
            <Card variant="raised" padding="md">
              <p className="text-caption font-semibold text-neutral-500 mb-3">Service card</p>
              <SkeletonCard />
            </Card>
            <Card variant="raised" padding="md">
              <p className="text-caption font-semibold text-neutral-500 mb-3">Mixed</p>
              <div className="space-y-3">
                <Skeleton variant="rectangle" height={80} />
                <Skeleton variant="line" width="60%" />
                <Skeleton variant="line" width="40%" />
              </div>
            </Card>
          </div>

          {/* ════════════════════ MODALS ════════════════════ */}
          <SectionHeader id="modals" label="Modals & Sheets" description="Responsive: bottom sheet on mobile, centered modal on desktop. Focus trap, Escape to close." />

          <div className="flex gap-3">
            <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          </div>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Cancel booking">
            <p className="text-body text-neutral-600 mb-2">
              Are you sure you want to cancel this booking?
            </p>
            <p className="text-body-sm text-neutral-500 mb-6">
              Cancellations within 2 hours of the scheduled time may be subject to a fee.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Keep booking</Button>
              <Button variant="danger" onClick={() => setModalOpen(false)}>Cancel booking</Button>
            </div>
          </Modal>

          {/* ════════════════════ TOASTS ════════════════════ */}
          <SectionHeader id="toasts" label="Toasts" description="4 variants with auto-dismiss (5s). Context-based via ToastProvider + useToast()." />

          <ToastDemo />

          {/* ════════════════════ DATA STATE ════════════════════ */}
          <SectionHeader id="datastate" label="Data States" description="Every data-consuming component handles 4 states: loading, error, empty, success." />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card variant="raised" padding="md">
              <p className="text-caption font-semibold text-primary-500 mb-3">Loading</p>
              <DataState data={undefined} isLoading={true} error={null} skeletonCount={1}>
                {() => null}
              </DataState>
            </Card>
            <Card variant="raised" padding="md">
              <p className="text-caption font-semibold text-danger-500 mb-3">Error</p>
              <DataState data={undefined} isLoading={false} error={new Error('Network error')} onRetry={() => {}}>
                {() => null}
              </DataState>
            </Card>
            <Card variant="raised" padding="md">
              <p className="text-caption font-semibold text-warning-500 mb-3">Empty</p>
              <DataState data={[]} isLoading={false} error={null} emptyMessage="No bookings yet" emptyCta={{ label: 'Browse', onClick: () => {} }}>
                {() => null}
              </DataState>
            </Card>
            <Card variant="raised" padding="md">
              <p className="text-caption font-semibold text-success-500 mb-3">Success</p>
              <DataState data={['item']} isLoading={false} error={null}>
                {(data) => (
                  <div className="flex items-center gap-2 py-4">
                    <div className="w-3 h-3 rounded-full bg-success-500" />
                    <p className="text-body-sm text-neutral-700">{data.length} item loaded</p>
                  </div>
                )}
              </DataState>
            </Card>
          </div>

          {/* ════════════════════ STICKY BAR ════════════════════ */}
          <SectionHeader id="stickybar" label="Sticky Bar" description="Fixed bottom bar with cart icon, price summary, and CTA. 72px height. Per Figma cart screen." />

          <Card variant="raised" padding="md">
            <p className="text-body-sm text-neutral-500 mb-3">
              The sticky bar is rendered fixed at the bottom of the viewport. Scroll down to see it.
            </p>
            <div className="flex gap-3 flex-wrap text-body-sm">
              <Badge variant="primary">Cart icon + count badge</Badge>
              <Badge variant="primary">INR price</Badge>
              <Badge variant="primary">Service count</Badge>
              <Badge variant="primary">Duration</Badge>
              <Badge variant="primary">Continue CTA</Badge>
            </div>
          </Card>

          {/* ── Bottom Nav Preview (for reference) ── */}
          <div className="mt-12 pb-8">
            <p className="text-caption font-semibold text-neutral-500 mb-3">Bottom Navigation Preview (F2)</p>
            <div className="bg-neutral-0 rounded-xl border border-neutral-300 px-4 py-3 flex items-center justify-around max-w-sm">
              {[
                { icon: <Home size={24} />, label: 'Home', active: true },
                { icon: <ShoppingBag size={24} />, label: 'Services', active: false },
                { icon: <Calendar size={24} />, label: 'Bookings', active: false },
                { icon: <BellRing size={24} />, label: 'Alerts', active: false },
                { icon: <UserCircle size={24} />, label: 'Profile', active: false },
              ].map((item) => (
                <div key={item.label} className={`flex flex-col items-center gap-0.5 ${item.active ? 'text-primary-500' : 'text-neutral-500'}`}>
                  {item.icon}
                  <span className="text-[10px] font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <StickyBottomBar
        totalPrice={450}
        serviceCount={3}
        duration="1hr - 1hr 30 min"
        onCtaClick={() => alert('Continue clicked')}
      />
    </ToastProvider>
  );
}

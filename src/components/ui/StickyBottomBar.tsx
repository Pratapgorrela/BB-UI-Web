import { type ReactNode } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from './Button';

interface StickyBottomBarProps {
  totalPrice: number;
  serviceCount: number;
  duration?: string;
  ctaLabel?: string;
  onCtaClick: () => void;
  currency?: string;
  /** Pre-formatted price (e.g. `formatPrice(...)` → "₹1,299"); overrides currency + totalPrice display. */
  priceLabel?: string;
  /** Replaces the "{N} Service(s)" caption text; duration still appends after "·". */
  subtitle?: string;
  /** 'fixed' pins to the viewport (default); 'sticky' sticks inside a scroll container (e.g. a bottom sheet). */
  position?: 'fixed' | 'sticky';
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

function StickyBottomBar({
  totalPrice,
  serviceCount,
  duration,
  ctaLabel = 'Continue',
  onCtaClick,
  currency = 'INR',
  priceLabel,
  subtitle,
  position = 'fixed',
  disabled = false,
  className = '',
}: StickyBottomBarProps) {
  return (
    <div
      className={[
        position === 'sticky' ? 'sticky bottom-0 w-full' : 'fixed bottom-0 left-0 right-0',
        'z-(--z-sticky)',
        'bg-neutral-0 border-t border-neutral-300 shadow-lg',
        'h-booking-cta px-4',
        'flex items-center gap-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Cart icon with badge */}
      <div className="relative shrink-0">
        <ShoppingCart size={24} className="text-primary-500" />
        {serviceCount > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-danger-500 text-neutral-0 text-[10px] font-bold">
            {serviceCount}
          </span>
        )}
      </div>

      {/* Price & info */}
      <div className="flex-1 min-w-0">
        <p className="text-body font-bold text-neutral-800">
          {priceLabel ?? `${currency} ${totalPrice.toLocaleString('en-IN')}`}
        </p>
        <p className="text-caption text-neutral-500 truncate">
          {subtitle ?? `${serviceCount} ${serviceCount === 1 ? 'Service' : 'Services'}`}
          {duration && ` \u00B7 ${duration}`}
        </p>
      </div>

      {/* CTA */}
      <Button
        variant="primary"
        size="md"
        onClick={onCtaClick}
        disabled={disabled}
        className="shrink-0 px-8"
      >
        {ctaLabel}
      </Button>
    </div>
  );
}

export { StickyBottomBar };
export type { StickyBottomBarProps };

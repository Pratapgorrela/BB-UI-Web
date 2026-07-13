import { useState } from 'react';
import { Tag, X } from 'lucide-react';
import { Button, TextInput } from '../../../components/ui';
import type { Coupon } from '../types/cart';

interface CouponSectionProps {
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  onApply: (code: string) => void;
  onRemove: () => void;
  /** Message shown when the last applied code was rejected (invalid / minimum not met). */
  errorMessage?: string;
  isValidating?: boolean;
}

function CouponSection({
  coupons,
  appliedCoupon,
  onApply,
  onRemove,
  errorMessage,
  isValidating = false,
}: CouponSectionProps) {
  const [code, setCode] = useState('');

  const handleApply = () => {
    const trimmed = code.trim();
    if (trimmed) onApply(trimmed);
  };

  return (
    <section aria-labelledby="coupon-heading" className="flex flex-col gap-3">
      <h2 id="coupon-heading" className="font-heading text-body font-semibold text-neutral-900">
        Offers &amp; coupons
      </h2>

      {appliedCoupon ? (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-success-500 bg-success-100 px-3 py-2.5">
          <span className="flex min-w-0 items-center gap-2">
            <Tag size={16} className="shrink-0 text-success-600" aria-hidden="true" />
            <span className="min-w-0">
              <span className="font-mono text-body-sm font-semibold text-success-700">
                {appliedCoupon.code}
              </span>
              <span className="ml-2 truncate text-caption text-neutral-600">
                {appliedCoupon.label} applied
              </span>
            </span>
          </span>
          <button
            type="button"
            aria-label={`Remove coupon ${appliedCoupon.code}`}
            onClick={onRemove}
            className="shrink-0 rounded-md p-1 text-neutral-500 transition-colors duration-fast ease-fast hover:bg-neutral-200 hover:text-neutral-700 focus-visible:shadow-focus focus-visible:outline-none"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <TextInput
                aria-label="Coupon code"
                placeholder="Enter coupon code"
                value={code}
                error={errorMessage}
                leftIcon={<Tag size={16} />}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleApply();
                  }
                }}
              />
            </div>
            <Button
              variant="outline"
              size="md"
              onClick={handleApply}
              disabled={isValidating || code.trim().length === 0}
              className="shrink-0"
            >
              Apply
            </Button>
          </div>

          {coupons.length > 0 && (
            <ul className="flex flex-col gap-2">
              {coupons.map((coupon) => (
                <li key={coupon.code}>
                  <button
                    type="button"
                    onClick={() => onApply(coupon.code)}
                    disabled={isValidating}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-dashed border-neutral-300 px-3 py-2.5 text-left transition-colors duration-fast ease-fast hover:border-primary-400 hover:bg-primary-100/40 focus-visible:shadow-focus focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="min-w-0">
                      <span className="font-mono text-body-sm font-semibold text-primary-600">
                        {coupon.code}
                      </span>
                      <span className="block truncate text-caption text-neutral-500">
                        {coupon.description}
                      </span>
                    </span>
                    <span className="shrink-0 text-body-sm font-semibold text-primary-600">
                      Apply
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}

export { CouponSection };
export type { CouponSectionProps };

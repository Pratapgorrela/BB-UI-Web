import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Skeleton } from '../../../components/ui';
import { formatPrice } from '../../../utils/format';
import type { PaymentSummary } from '../types/cart';

interface PaymentSummaryCardProps {
  summary: PaymentSummary | undefined;
  isLoading?: boolean;
  defaultOpen?: boolean;
}

function Row({
  label,
  value,
  emphasis = false,
  positive = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={
          emphasis ? 'text-body font-semibold text-neutral-900' : 'text-body-sm text-neutral-600'
        }
      >
        {label}
      </span>
      <span
        className={[
          'font-mono',
          emphasis ? 'text-body font-bold text-neutral-900' : 'text-body-sm',
          positive ? 'text-success-600' : emphasis ? '' : 'text-neutral-800',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {value}
      </span>
    </div>
  );
}

/** Expandable payment breakdown (Services Charges / Discount / Taxes / Total). */
function PaymentSummaryCard({ summary, isLoading, defaultOpen = true }: PaymentSummaryCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (isLoading && !summary) {
    return (
      <div className="rounded-lg border border-neutral-200 p-4">
        <Skeleton variant="line" width="50%" />
        <Skeleton variant="line" width="80%" className="mt-3" />
        <Skeleton variant="line" width="70%" className="mt-2" />
      </div>
    );
  }

  if (!summary) return null;

  const hasDiscount = summary.discount.amount > 0;

  return (
    <div className="rounded-lg border border-neutral-200">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-4 py-3 text-left focus-visible:shadow-focus focus-visible:outline-none"
      >
        <span className="font-heading text-body font-semibold text-neutral-900">
          Payment summary
        </span>
        <span className="flex items-center gap-2">
          <span className="font-mono text-body font-bold text-neutral-900">
            {formatPrice(summary.total)}
          </span>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className={[
              'text-neutral-500 transition-transform duration-fast ease-fast',
              open ? 'rotate-180' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        </span>
      </button>

      {open && (
        <div className="flex flex-col gap-2.5 border-t border-neutral-100 px-4 py-3">
          <Row label="Services charges" value={formatPrice(summary.serviceCharges)} />
          {hasDiscount && (
            <Row
              label={
                summary.appliedCoupon
                  ? `Discount (${summary.appliedCoupon.code})`
                  : 'Discount'
              }
              value={`− ${formatPrice(summary.discount)}`}
              positive
            />
          )}
          <Row label={`Taxes (${summary.taxRatePercent}% GST)`} value={formatPrice(summary.taxes)} />
          <div className="mt-1 border-t border-neutral-100 pt-2.5">
            <Row label="Total" value={formatPrice(summary.total)} emphasis />
          </div>
        </div>
      )}
    </div>
  );
}

export { PaymentSummaryCard };
export type { PaymentSummaryCardProps };

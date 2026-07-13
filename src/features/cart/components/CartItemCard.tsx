import { Check, Clock, Minus, Plus, Trash2 } from 'lucide-react';
import { Card, DiscountBadge } from '../../../components/ui';
import { formatDuration, formatPrice } from '../../../utils/format';
import type { CartItem } from '../types/cart';

interface CartItemCardProps {
  item: CartItem;
  onToggleSelected: (serviceId: string) => void;
  onQuantityChange: (serviceId: string, quantity: number) => void;
  onRemove: (serviceId: string) => void;
}

function CartItemCard({ item, onToggleSelected, onQuantityChange, onRemove }: CartItemCardProps) {
  const { service, quantity, selected } = item;

  return (
    <Card variant="default" padding="none" className="flex gap-3 p-3">
      {/* Select checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={selected}
        aria-label={selected ? `Deselect ${service.name}` : `Select ${service.name}`}
        onClick={() => onToggleSelected(item.serviceId)}
        className={[
          'mt-1 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-fast ease-fast focus-visible:shadow-focus focus-visible:outline-none',
          selected
            ? 'border-primary-500 bg-primary-500 text-neutral-0'
            : 'border-neutral-300 bg-neutral-0',
        ].join(' ')}
      >
        {selected && <Check size={14} aria-hidden="true" />}
      </button>

      <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-neutral-200">
        <img
          src={service.imageUrl}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="size-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start gap-2">
          <h3
            title={service.name}
            className="min-w-0 flex-1 truncate font-heading text-body font-semibold text-neutral-900"
          >
            {service.name}
          </h3>
          <button
            type="button"
            aria-label={`Remove ${service.name}`}
            onClick={() => onRemove(item.serviceId)}
            className="shrink-0 rounded-md p-1 text-neutral-400 transition-colors duration-fast ease-fast hover:bg-danger-100 hover:text-danger-600 focus-visible:shadow-focus focus-visible:outline-none"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-neutral-500">
          <span>{service.type === 'COMBO' ? 'Combo' : 'Single'}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock size={12} aria-hidden="true" />
            {formatDuration(service.duration)}
          </span>
          {service.discountPercent != null && (
            <DiscountBadge percentage={service.discountPercent} />
          )}
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="font-mono text-body font-semibold text-neutral-900">
            {formatPrice(item.lineTotal)}
          </span>

          {/* Quantity stepper */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={`Decrease ${service.name} quantity`}
              onClick={() => onQuantityChange(item.serviceId, quantity - 1)}
              disabled={quantity <= 1}
              className="flex size-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors duration-fast ease-fast hover:bg-neutral-100 focus-visible:shadow-focus focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus size={14} aria-hidden="true" />
            </button>
            <span
              aria-label={`Quantity ${quantity}`}
              className="min-w-5 text-center text-body-sm font-semibold text-neutral-800"
            >
              {quantity}
            </span>
            <button
              type="button"
              aria-label={`Increase ${service.name} quantity`}
              onClick={() => onQuantityChange(item.serviceId, quantity + 1)}
              className="flex size-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors duration-fast ease-fast hover:bg-neutral-100 focus-visible:shadow-focus focus-visible:outline-none"
            >
              <Plus size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export { CartItemCard };
export type { CartItemCardProps };

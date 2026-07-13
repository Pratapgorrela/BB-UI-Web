import { formatPrice } from '../../../utils/format';
import type { CartItem } from '../types/cart';

interface CheckoutItemsListProps {
  items: CartItem[];
}

/** The read-only "Your services" summary on the checkout page. */
function CheckoutItemsList({ items }: CheckoutItemsListProps) {
  return (
    <section aria-labelledby="summary-heading" className="flex flex-col gap-2">
      <h2 id="summary-heading" className="font-heading text-body font-semibold text-neutral-900">
        Your services
      </h2>
      <ul className="flex flex-col divide-y divide-neutral-100 rounded-lg bg-neutral-0 px-4">
        {items.map((item) => (
          <li
            key={item.serviceId}
            className="flex items-center justify-between gap-3 py-3 text-body-sm"
          >
            <span className="min-w-0 truncate text-neutral-700">
              {item.service.name}
              {item.quantity > 1 && <span className="text-neutral-400"> × {item.quantity}</span>}
            </span>
            <span className="shrink-0 font-mono font-semibold text-neutral-900">
              {formatPrice(item.lineTotal)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { CheckoutItemsList };

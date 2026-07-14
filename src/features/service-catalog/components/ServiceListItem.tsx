import { Plus } from 'lucide-react';
import { DiscountBadge } from '../../../components/ui';
import { formatPrice } from '../../../utils/format';
import type { Service } from '../types/catalog';

interface ServiceListItemProps {
  service: Service;
  /** When set, tapping the thumbnail/name opens the item (e.g. navigate to detail). */
  onOpen?: (service: Service) => void;
  onAdd?: (service: Service) => void;
  className?: string;
}

function ServiceListItem({ service, onOpen, onAdd, className = '' }: ServiceListItemProps) {
  const content = (
    <>
      <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-neutral-200">
        <img
          src={service.imageUrl}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
        <div className="flex items-center gap-2">
          <h3
            title={service.name}
            className="truncate font-heading text-body font-semibold text-neutral-900"
          >
            {service.name}
          </h3>
          {service.discountPercent != null && (
            <DiscountBadge percentage={service.discountPercent} className="shrink-0" />
          )}
        </div>
        <p className="truncate text-body-sm text-neutral-500">{service.shortDescription}</p>
        <span className="font-mono text-body-sm font-semibold text-neutral-900">
          {formatPrice(service.price)}
        </span>
      </div>
    </>
  );

  return (
    <div className={['flex items-center gap-3 py-3', className].filter(Boolean).join(' ')}>
      {onOpen ? (
        <button
          type="button"
          onClick={() => onOpen(service)}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left transition-colors duration-fast ease-fast focus-visible:shadow-focus focus-visible:outline-none"
        >
          {content}
        </button>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3">{content}</div>
      )}

      {onAdd && (
        <button
          type="button"
          aria-label={`Add ${service.name}`}
          onClick={() => onAdd(service)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors duration-fast ease-fast hover:bg-neutral-200 focus-visible:shadow-focus focus-visible:outline-none"
        >
          <Plus size={20} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export { ServiceListItem };
export type { ServiceListItemProps };

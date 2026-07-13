import { Clock, Plus, Star } from 'lucide-react';
import { Badge, Card, DiscountBadge } from '../../../components/ui';
import { formatDuration, formatPrice } from '../../../utils/format';
import type { Service } from '../types/catalog';

interface ServiceCardProps {
  service: Service;
  onAdd?: (service: Service) => void;
  className?: string;
}

function ServiceCard({ service, onAdd, className = '' }: ServiceCardProps) {
  return (
    <Card variant="raised" padding="none" className={['flex flex-col', className].filter(Boolean).join(' ')}>
      <div className="relative aspect-[4/3] bg-neutral-200">
        <img
          src={service.imageUrl}
          alt={service.name}
          loading="lazy"
          className="size-full object-cover"
        />
        {service.discountPercent != null && (
          <DiscountBadge percentage={service.discountPercent} className="absolute left-2 top-2 shadow-md" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3
          title={service.name}
          className="line-clamp-1 font-heading text-h3 font-semibold text-neutral-800"
        >
          {service.name}
        </h3>
        <p className="line-clamp-2 text-body-sm text-neutral-600">{service.shortDescription}</p>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-body-sm font-medium text-neutral-800">
            <Star size={16} className="fill-warning-500 text-warning-500" aria-hidden="true" />
            {service.rating.toFixed(1)}
            <span className="text-caption font-normal text-neutral-500">({service.reviewCount})</span>
          </span>
          <Badge>
            <Clock size={12} className="mr-1" aria-hidden="true" />
            {formatDuration(service.duration)}
          </Badge>
          {service.type === 'COMBO' && <Badge variant="primary">Combo</Badge>}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            {service.originalPrice && (
              <span className="font-mono text-mono text-neutral-500 line-through">
                {formatPrice(service.originalPrice)}
              </span>
            )}
            <span className="font-mono text-body font-semibold text-neutral-900">
              {formatPrice(service.price)}
            </span>
          </div>
          {onAdd && (
            <button
              type="button"
              aria-label={`Add ${service.name}`}
              onClick={() => onAdd(service)}
              className="flex size-touch-target shrink-0 items-center justify-center rounded-full border border-primary-500 text-primary-600 transition-colors duration-fast ease-fast hover:bg-primary-100 focus-visible:shadow-focus focus-visible:outline-none"
            >
              <Plus size={20} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

export { ServiceCard };
export type { ServiceCardProps };

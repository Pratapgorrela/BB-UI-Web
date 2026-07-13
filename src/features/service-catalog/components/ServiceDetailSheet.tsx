import { Check, Plus } from 'lucide-react';
import { Button, DiscountBadge } from '../../../components/ui';
import { formatDuration, formatPrice } from '../../../utils/format';
import { deriveServiceRelations } from '../utils/serviceRelations';
import type { Service } from '../types/catalog';

interface ServiceDetailSheetProps {
  service: Service;
  /** Same-category pool used to resolve combo inclusions + recommendations. */
  categoryServices: Service[];
  /** Ids of services currently in the cart — drives the +/✓ toggle states. */
  cartServiceIds: ReadonlySet<string>;
  /** Adds when absent from the cart, removes when present. */
  onToggleCart: (service: Service) => void;
  /** Promo banner CTA. */
  onExplore: () => void;
}

interface CartToggleButtonProps {
  inCart: boolean;
  serviceName: string;
  onClick: () => void;
}

/** Round floating +/✓ — + adds to cart, ✓ (in cart) removes again. */
function CartToggleButton({ inCart, serviceName, onClick }: CartToggleButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={inCart}
      aria-label={inCart ? `Remove ${serviceName} from cart` : `Add ${serviceName} to cart`}
      onClick={onClick}
      className={[
        'flex size-10 shrink-0 items-center justify-center rounded-full shadow-md',
        'transition-colors duration-fast ease-fast focus-visible:shadow-focus focus-visible:outline-none',
        inCart
          ? 'bg-primary-500 text-neutral-0 hover:bg-primary-600'
          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
      ].join(' ')}
    >
      {inCart ? <Check size={20} aria-hidden="true" /> : <Plus size={20} aria-hidden="true" />}
    </button>
  );
}

interface RelatedServiceCardProps {
  service: Service;
  inCart?: boolean;
  /** When set, renders the Add/Added toggle (recommended add-ons); omit for combo inclusions. */
  onToggle?: (service: Service) => void;
}

/** Labeled thumbnail mini-card for "Plan includes" / "Recommended" rows. */
function RelatedServiceCard({ service, inCart = false, onToggle }: RelatedServiceCardProps) {
  return (
    <div className="flex w-28 shrink-0 flex-col gap-1.5">
      <span
        title={service.name}
        className="truncate text-center text-caption font-medium text-neutral-700"
      >
        {service.name}
      </span>
      <div className="aspect-4/5 w-full overflow-hidden rounded-lg bg-neutral-200">
        <img
          src={service.imageUrl}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      {onToggle && (
        <Button
          variant={inCart ? 'secondary' : 'outline'}
          size="sm"
          fullWidth
          aria-pressed={inCart}
          aria-label={inCart ? `Remove ${service.name} from cart` : `Add ${service.name} to cart`}
          onClick={() => onToggle(service)}
          leftIcon={inCart ? <Check size={14} aria-hidden="true" /> : undefined}
        >
          {inCart ? 'Added' : 'Add'}
        </Button>
      )}
    </div>
  );
}

/**
 * Full service details rendered inside the bottom-sheet Modal on category pages
 * (Figma popup design). Presentational — cart state and navigation come in as props.
 */
function ServiceDetailSheet({
  service,
  categoryServices,
  cartServiceIds,
  onToggleCart,
  onExplore,
}: ServiceDetailSheetProps) {
  const { included, recommended } = deriveServiceRelations(service, categoryServices);
  const inCart = cartServiceIds.has(service.id);
  const isCombo = service.type === 'COMBO';
  const related = isCombo ? included : recommended;

  return (
    <div>
      {/* Hero — edge-to-edge; the panel's rounded top clips the corners */}
      <div className="relative">
        <img src={service.imageUrl} alt="" aria-hidden="true" className="h-52 w-full object-cover" />
        {service.discountPercent != null && (
          <DiscountBadge
            percentage={service.discountPercent}
            variant="primary"
            className="absolute right-3 top-3 shadow-md"
          />
        )}
      </div>

      <div className="px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-4">
        {/* Title + price */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-heading text-h3 font-bold text-neutral-900">{service.name}</h2>
          <div className="flex shrink-0 items-baseline gap-2 pt-1">
            {service.originalPrice && (
              <span className="font-mono text-body-sm text-neutral-400 line-through">
                {formatPrice(service.originalPrice)}
              </span>
            )}
            <span className="font-mono text-h4 font-bold text-neutral-900">
              {formatPrice(service.price)}
            </span>
          </div>
        </div>

        <p className="mt-1 text-body-sm text-neutral-600">
          Duration - {formatDuration(service.duration)}
        </p>

        {/* Description with the floating +/✓ toggle */}
        <div className="mt-3 flex items-start gap-3">
          <p className="flex-1 text-body-sm text-neutral-600">{service.description}</p>
          <CartToggleButton
            inCart={inCart}
            serviceName={service.name}
            onClick={() => onToggleCart(service)}
          />
        </div>

        {/* Plan includes (combos) / Recommended (singles) */}
        {related.length > 0 && (
          <section className="mt-5">
            <h3 className="font-heading text-body font-semibold text-neutral-800">
              {isCombo ? 'Plan includes' : 'Recommended'}
            </h3>
            <div className="-mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-1">
              {related.map((item) => (
                <RelatedServiceCard
                  key={item.id}
                  service={item}
                  inCart={isCombo ? undefined : cartServiceIds.has(item.id)}
                  onToggle={isCombo ? undefined : onToggleCart}
                />
              ))}
            </div>
          </section>
        )}

        {/* Promo banner (static; purple CTA per the approved F3 palette precedent) */}
        <div className="mt-5 flex items-center gap-3 rounded-lg bg-warning-100 p-4">
          <div className="min-w-0 flex-1">
            <p className="font-heading text-body font-semibold text-neutral-900">
              Self-Care Sundays, Delivered
            </p>
            <p className="mt-0.5 text-caption text-neutral-600">
              Pamper yourself without leaving the house.
            </p>
            <Button variant="primary" size="sm" onClick={onExplore} className="mt-2">
              Explore Now
            </Button>
          </div>
          <div className="size-24 shrink-0 overflow-hidden rounded-lg bg-neutral-200">
            <img
              src={service.galleryUrls[0] ?? service.imageUrl}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { ServiceDetailSheet };
export type { ServiceDetailSheetProps };

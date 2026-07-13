import { useNavigate } from 'react-router-dom';
import type { Offer, OfferTheme } from '../types/home';

const scrimStyles: Record<OfferTheme, string> = {
  DARK: 'bg-gradient-to-t from-neutral-900/90 via-neutral-900/55 to-neutral-900/25',
  PRIMARY: 'bg-gradient-to-t from-primary-800/90 via-primary-700/60 to-primary-600/30',
};

interface OfferCardProps {
  offer: Offer;
}

/** Promotional banner card for the "Offers for You" carousel. */
function OfferCard({ offer }: OfferCardProps) {
  const navigate = useNavigate();

  return (
    <article className="relative flex h-44 w-72 shrink-0 flex-col justify-end overflow-hidden rounded-lg">
      <img
        src={offer.imageUrl}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 size-full object-cover"
      />
      <div className={`absolute inset-0 ${scrimStyles[offer.theme]}`} aria-hidden="true" />

      <div className="relative flex flex-col items-start gap-1 p-4 text-neutral-0">
        <h3 className="font-heading text-h4 font-semibold">{offer.title}</h3>
        <p className="text-body-sm text-neutral-100">{offer.subtitle}</p>
        <button
          type="button"
          onClick={() => void navigate(offer.targetPath)}
          className="mt-2 rounded-md bg-neutral-0 px-3 py-1.5 text-body-sm font-semibold text-neutral-900 transition-colors duration-fast ease-fast hover:bg-neutral-100 focus-visible:shadow-focus focus-visible:outline-none"
        >
          {offer.ctaLabel}
        </button>
      </div>
    </article>
  );
}

export { OfferCard };
export type { OfferCardProps };

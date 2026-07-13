import type { Money } from '../../../types/common';

/** Colour treatment for a promotional offer card. */
type OfferTheme = 'DARK' | 'PRIMARY';

/** Home-screen promotional banner ("Offers for You"). Editorial content, not tied to a Service. */
interface Offer {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  /** In-app route the CTA navigates to, e.g. `/services`. */
  targetPath: string;
  imageUrl: string;
  theme: OfferTheme;
  sortOrder: number;
}

/**
 * Home-screen featured testimonial ("What Our Customers Say").
 * Curated content — distinct from the per-service Review entity (F10).
 */
interface Testimonial {
  id: string;
  authorName: string;
  authorLocation: string;
  avatarUrl: string | null;
  rating: number;
  quote: string;
  createdAt: string;
}

/** Referral reward info for the "Share the Beauty, Get Rewarded" card. */
interface Referral {
  code: string;
  referrerReward: Money;
  refereeDiscount: Money;
}

export type { Offer, OfferTheme, Referral, Testimonial };

import type { Money } from '../../types/common';
import type { Service, ServiceType } from '../../features/service-catalog/types/catalog';
import { categoryIds } from './categories.data';

/** Stable service ID from a seed number (1..n). */
function sid(n: number): string {
  return `bb5e0000-0000-4000-8000-${String(n).padStart(12, '0')}`;
}

function inr(rupees: number): Money {
  return { amount: rupees * 100, currency: 'INR' };
}

interface SeedServiceInput {
  n: number;
  categoryId: string;
  type: ServiceType;
  name: string;
  shortDescription: string;
  description?: string;
  priceInr: number;
  originalPriceInr?: number;
  discountPercent?: number;
  /** Seed numbers of the bundled SINGLE services (combos only). */
  includedNs?: number[];
  duration: number;
  isPopular?: boolean;
  rating: number;
  reviewCount: number;
  tags?: string[];
  createdAt: string;
  withGallery?: boolean;
}

function makeService(input: SeedServiceInput): Service {
  return {
    id: sid(input.n),
    categoryId: input.categoryId,
    type: input.type,
    name: input.name,
    description:
      input.description ??
      `${input.shortDescription} Performed at your home by trained Beauty Bus professionals using salon-grade, fully sanitized kits.`,
    shortDescription: input.shortDescription,
    imageUrl: `https://picsum.photos/seed/bb-svc-${input.n}/600/450`,
    galleryUrls: input.withGallery
      ? [
          `https://picsum.photos/seed/bb-svc-${input.n}-a/600/450`,
          `https://picsum.photos/seed/bb-svc-${input.n}-b/600/450`,
        ]
      : [],
    price: inr(input.priceInr),
    originalPrice: input.originalPriceInr != null ? inr(input.originalPriceInr) : null,
    discountPercent: input.discountPercent ?? null,
    includedServiceIds: (input.includedNs ?? []).map(sid),
    duration: input.duration,
    isPopular: input.isPopular ?? false,
    rating: input.rating,
    reviewCount: input.reviewCount,
    tags: input.tags ?? [],
    createdAt: input.createdAt,
  };
}

const seedServices: Service[] = [
  /* ── Men (4 combos + 6 singles) ── */
  makeService({
    n: 1, categoryId: categoryIds.men, type: 'COMBO', name: 'Haircut + Beard Classic',
    shortDescription: 'Classic haircut and precise beard trim in one sitting.',
    priceInr: 400, originalPriceInr: 500, discountPercent: 20, includedNs: [5, 6],
    duration: 50, isPopular: true, rating: 4.7, reviewCount: 812, tags: ['bestseller'],
    createdAt: '2026-03-02T10:00:00.000Z',
  }),
  makeService({
    n: 2, categoryId: categoryIds.men, type: 'COMBO', name: 'Groom & Go Express',
    shortDescription: 'Haircut plus express face cleanup — ready in under an hour.',
    priceInr: 600, originalPriceInr: 750, discountPercent: 20, includedNs: [5, 8],
    duration: 55, rating: 4.5, reviewCount: 341, createdAt: '2026-03-10T10:00:00.000Z',
  }),
  makeService({
    n: 3, categoryId: categoryIds.men, type: 'COMBO', name: 'Head-to-Toe Refresh',
    shortDescription: 'Haircut, de-tan pack and relaxing champi for a full reset.',
    priceInr: 760, originalPriceInr: 950, discountPercent: 20, includedNs: [5, 9, 10],
    duration: 95, rating: 4.6, reviewCount: 210, createdAt: '2026-03-18T10:00:00.000Z',
  }),
  makeService({
    n: 4, categoryId: categoryIds.men, type: 'COMBO', name: 'De-Tan & Glow Duo',
    shortDescription: 'Face cleanup paired with a de-tan pack for an instant glow.',
    priceInr: 680, originalPriceInr: 850, discountPercent: 20, includedNs: [8, 9],
    duration: 70, rating: 4.4, reviewCount: 156, tags: ['new'],
    createdAt: '2026-05-01T10:00:00.000Z',
  }),
  makeService({
    n: 5, categoryId: categoryIds.men, type: 'SINGLE', name: 'Classic Haircut',
    shortDescription: 'Precision haircut styled to your face shape and preference.',
    priceInr: 299, duration: 30, isPopular: true, rating: 4.8, reviewCount: 1520,
    tags: ['bestseller'], createdAt: '2026-03-01T10:00:00.000Z', withGallery: true,
  }),
  makeService({
    n: 6, categoryId: categoryIds.men, type: 'SINGLE', name: 'Beard Trim & Shape',
    shortDescription: 'Sharp beard lines, trim and conditioning finish.',
    priceInr: 199, duration: 20, rating: 4.7, reviewCount: 980,
    createdAt: '2026-03-01T10:30:00.000Z',
  }),
  makeService({
    n: 7, categoryId: categoryIds.men, type: 'SINGLE', name: 'Hair Color (Ammonia-Free)',
    shortDescription: 'Natural-look grey coverage with ammonia-free color.',
    priceInr: 549, duration: 45, rating: 4.3, reviewCount: 265,
    createdAt: '2026-03-12T10:00:00.000Z',
  }),
  makeService({
    n: 8, categoryId: categoryIds.men, type: 'SINGLE', name: 'Express Face Cleanup',
    shortDescription: 'Deep-cleansing 25-minute cleanup for tired, dull skin.',
    priceInr: 449, duration: 25, rating: 4.5, reviewCount: 402,
    createdAt: '2026-03-15T10:00:00.000Z',
  }),
  makeService({
    n: 9, categoryId: categoryIds.men, type: 'SINGLE', name: 'De-Tan Face Pack',
    shortDescription: 'Removes tan and evens skin tone in a single session.',
    priceInr: 399, duration: 30, rating: 4.4, reviewCount: 318,
    createdAt: '2026-04-02T10:00:00.000Z',
  }),
  makeService({
    n: 10, categoryId: categoryIds.men, type: 'SINGLE', name: 'Head Massage (Champi)',
    shortDescription: 'Traditional oil champi to melt stress away.',
    priceInr: 249, duration: 20, isPopular: true, rating: 4.9, reviewCount: 1104,
    createdAt: '2026-04-05T10:00:00.000Z',
  }),

  /* ── Women (3 combos + 6 singles) ── */
  makeService({
    n: 11, categoryId: categoryIds.women, type: 'COMBO', name: 'Party-Ready Glam',
    shortDescription: 'Haircut with blow-dry plus a radiant gold facial.',
    priceInr: 1200, originalPriceInr: 1500, discountPercent: 20, includedNs: [14, 16],
    duration: 90, isPopular: true, rating: 4.8, reviewCount: 674, tags: ['bestseller'],
    createdAt: '2026-03-05T10:00:00.000Z',
  }),
  makeService({
    n: 12, categoryId: categoryIds.women, type: 'COMBO', name: 'Hair Spa & Style',
    shortDescription: 'Nourishing hair spa ritual followed by a fresh cut and style.',
    priceInr: 880, originalPriceInr: 1100, discountPercent: 20, includedNs: [14, 15],
    duration: 75, isPopular: true, rating: 4.6, reviewCount: 445,
    createdAt: '2026-03-20T10:00:00.000Z',
  }),
  makeService({
    n: 13, categoryId: categoryIds.women, type: 'COMBO', name: 'Wax, Mani & Pedi Indulgence',
    shortDescription: 'Full arms and legs waxing with classic manicure and pedicure.',
    priceInr: 1120, originalPriceInr: 1400, discountPercent: 20, includedNs: [17, 18, 19],
    duration: 105, rating: 4.5, reviewCount: 289, createdAt: '2026-04-10T10:00:00.000Z',
  }),
  makeService({
    n: 14, categoryId: categoryIds.women, type: 'SINGLE', name: "Women's Haircut & Blow-Dry",
    shortDescription: 'Consultation, precision cut and a salon-finish blow-dry.',
    priceInr: 499, duration: 45, isPopular: true, rating: 4.7, reviewCount: 1310,
    createdAt: '2026-03-04T10:00:00.000Z', withGallery: true,
  }),
  makeService({
    n: 15, categoryId: categoryIds.women, type: 'SINGLE', name: 'Hair Spa Ritual',
    shortDescription: 'Deep-conditioning spa for soft, frizz-free hair.',
    priceInr: 599, duration: 45, rating: 4.6, reviewCount: 720,
    createdAt: '2026-03-08T10:00:00.000Z',
  }),
  makeService({
    n: 16, categoryId: categoryIds.women, type: 'SINGLE',
    name: 'Luxury Radiance Gold Facial with Neck, Shoulder & Full Arms Relaxation Massage Ritual',
    shortDescription:
      '24k gold facial that brightens, firms and deeply hydrates, finished with a calming neck, shoulder and full-arm massage.',
    priceInr: 999, duration: 60, isPopular: true, rating: 4.9, reviewCount: 856,
    tags: ['trending'], createdAt: '2026-03-25T10:00:00.000Z', withGallery: true,
  }),
  makeService({
    n: 17, categoryId: categoryIds.women, type: 'SINGLE', name: 'Full Arms & Legs Waxing',
    shortDescription: 'Smooth, long-lasting waxing with low-irritation formula.',
    priceInr: 649, duration: 50, rating: 4.4, reviewCount: 530,
    createdAt: '2026-04-01T10:00:00.000Z',
  }),
  makeService({
    n: 18, categoryId: categoryIds.women, type: 'SINGLE', name: 'Classic Manicure',
    shortDescription: 'Nail shaping, cuticle care and polish of your choice.',
    priceInr: 349, duration: 35, rating: 4.5, reviewCount: 415,
    createdAt: '2026-04-08T10:00:00.000Z',
  }),
  makeService({
    n: 19, categoryId: categoryIds.women, type: 'SINGLE', name: 'Classic Pedicure',
    shortDescription: 'Relaxing soak, scrub and polish for happy feet.',
    priceInr: 399, duration: 40, rating: 4.6, reviewCount: 468,
    createdAt: '2026-04-08T11:00:00.000Z',
  }),

  /* ── Kids (1 combo + 3 singles) ── */
  makeService({
    n: 20, categoryId: categoryIds.kids, type: 'COMBO', name: 'Kids Fun Makeover',
    shortDescription: 'Haircut plus sparkle nail art — a favorite with the kids.',
    priceInr: 440, originalPriceInr: 550, discountPercent: 20, includedNs: [21, 22],
    duration: 45, rating: 4.6, reviewCount: 198, createdAt: '2026-04-15T10:00:00.000Z',
  }),
  makeService({
    n: 21, categoryId: categoryIds.kids, type: 'SINGLE', name: 'Kids Haircut (Ages 3–12)',
    shortDescription: 'Patient, gentle haircuts for children — tears not included.',
    priceInr: 249, duration: 25, isPopular: true, rating: 4.8, reviewCount: 640,
    createdAt: '2026-04-12T10:00:00.000Z',
  }),
  makeService({
    n: 22, categoryId: categoryIds.kids, type: 'SINGLE', name: 'Kids Sparkle Nail Art',
    shortDescription: 'Kid-safe polish and playful nail art designs.',
    priceInr: 299, duration: 30, rating: 4.7, reviewCount: 154, tags: ['new'],
    createdAt: '2026-05-05T10:00:00.000Z',
  }),
  makeService({
    n: 23, categoryId: categoryIds.kids, type: 'SINGLE', name: 'Kids Gentle Head Massage',
    shortDescription: 'Soothing oil massage sized for little heads.',
    priceInr: 199, duration: 15, rating: 4.5, reviewCount: 88,
    createdAt: '2026-05-10T10:00:00.000Z',
  }),

  /* ── Seniors (0 combos + 3 singles — exercises the empty Combos section) ── */
  makeService({
    n: 24, categoryId: categoryIds.seniors, type: 'SINGLE', name: 'Senior Comfort Haircut',
    shortDescription: 'Unhurried haircuts with extra care and comfortable seating.',
    priceInr: 299, duration: 30, rating: 4.8, reviewCount: 512,
    createdAt: '2026-04-20T10:00:00.000Z',
  }),
  makeService({
    n: 25, categoryId: categoryIds.seniors, type: 'SINGLE', name: 'Gentle Head & Shoulder Massage',
    shortDescription: 'Light-pressure massage to ease stiffness and improve sleep.',
    priceInr: 349, duration: 30, rating: 4.9, reviewCount: 430,
    createdAt: '2026-04-22T10:00:00.000Z',
  }),
  makeService({
    n: 26, categoryId: categoryIds.seniors, type: 'SINGLE', name: 'At-Home Pedicure for Seniors',
    shortDescription: 'Safe, hygienic foot care with diabetic-friendly options.',
    priceInr: 449, duration: 45, rating: 4.7, reviewCount: 265,
    createdAt: '2026-05-02T10:00:00.000Z',
  }),

  /* ── Bride (2 combos + 3 singles) ── */
  makeService({
    n: 27, categoryId: categoryIds.bride, type: 'COMBO', name: 'Bridal Glow Package',
    shortDescription: 'Radiance facial plus hair and makeup trial before the big day.',
    priceInr: 1800, originalPriceInr: 2250, discountPercent: 20, includedNs: [29, 31],
    duration: 150, isPopular: true, rating: 4.9, reviewCount: 342, tags: ['bestseller'],
    createdAt: '2026-03-30T10:00:00.000Z', withGallery: true,
  }),
  makeService({
    n: 28, categoryId: categoryIds.bride, type: 'COMBO', name: 'Pre-Wedding Pamper Ritual',
    shortDescription: 'Facial, mehendi and trial session — the complete pre-wedding kit.',
    priceInr: 2600, originalPriceInr: 3250, discountPercent: 20, includedNs: [29, 30, 31],
    duration: 210, rating: 4.8, reviewCount: 187, createdAt: '2026-04-18T10:00:00.000Z',
  }),
  makeService({
    n: 29, categoryId: categoryIds.bride, type: 'SINGLE', name: 'Bridal Radiance Facial',
    shortDescription: 'Intensive brightening facial designed for wedding-day glow.',
    priceInr: 1299, duration: 75, rating: 4.8, reviewCount: 296,
    createdAt: '2026-03-28T10:00:00.000Z',
  }),
  makeService({
    n: 30, categoryId: categoryIds.bride, type: 'SINGLE', name: 'Bridal Mehendi (Both Hands)',
    shortDescription: 'Intricate bridal mehendi by specialist artists.',
    priceInr: 999, duration: 90, rating: 4.7, reviewCount: 220,
    createdAt: '2026-04-25T10:00:00.000Z',
  }),
  makeService({
    n: 31, categoryId: categoryIds.bride, type: 'SINGLE', name: 'Bridal Hair & Makeup Trial',
    shortDescription: 'Full trial run of your wedding look, adjusted to perfection.',
    priceInr: 949, duration: 60, rating: 4.6, reviewCount: 173,
    createdAt: '2026-05-08T10:00:00.000Z',
  }),

  /* ── Groom (1 combo + 2 singles) ── */
  makeService({
    n: 32, categoryId: categoryIds.groom, type: 'COMBO', name: 'Groom Shine Package',
    shortDescription: 'Facial with de-tan plus haircut and styling for the groom.',
    priceInr: 840, originalPriceInr: 1050, discountPercent: 20, includedNs: [33, 34],
    duration: 80, isPopular: true, rating: 4.7, reviewCount: 261,
    createdAt: '2026-04-06T10:00:00.000Z',
  }),
  makeService({
    n: 33, categoryId: categoryIds.groom, type: 'SINGLE', name: 'Groom Facial & De-Tan',
    shortDescription: 'Brightening facial and tan removal ahead of the wedding.',
    priceInr: 599, duration: 45, rating: 4.6, reviewCount: 340,
    createdAt: '2026-04-04T10:00:00.000Z',
  }),
  makeService({
    n: 34, categoryId: categoryIds.groom, type: 'SINGLE', name: 'Groom Haircut & Styling',
    shortDescription: 'Sharp cut and styling matched to your wedding outfit.',
    priceInr: 449, duration: 35, rating: 4.5, reviewCount: 289,
    createdAt: '2026-04-04T11:00:00.000Z',
  }),
];

export { seedServices };

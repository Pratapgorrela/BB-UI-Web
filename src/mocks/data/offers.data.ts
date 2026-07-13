import type { Offer } from '../../features/home/types/home';

/**
 * Seed promotional offers for the Home "Offers for You" carousel.
 * imageUrl uses picsum placeholders — real banner art drops into the same field later.
 */
const seedOffers: Offer[] = [
  {
    id: 'bb0f0000-0000-4000-8000-000000000001',
    title: 'Salon Luxury, Now on Wheels',
    subtitle: 'Why travel? Let beauty come to you.',
    ctaLabel: 'Book now',
    targetPath: '/services',
    imageUrl: 'https://picsum.photos/seed/bb-offer-luxury/640/360',
    theme: 'DARK',
    sortOrder: 1,
  },
  {
    id: 'bb0f0000-0000-4000-8000-000000000002',
    title: 'Bridal Bliss, Stress-free',
    subtitle: 'Look flawless on your big day — we come to you.',
    ctaLabel: 'Explore now',
    targetPath: '/categories/bride',
    imageUrl: 'https://picsum.photos/seed/bb-offer-bridal/640/360',
    theme: 'PRIMARY',
    sortOrder: 2,
  },
  {
    id: 'bb0f0000-0000-4000-8000-000000000003',
    title: 'Weekend Glow Up',
    subtitle: 'Limited-time deals on premium facials.',
    ctaLabel: 'Book now',
    targetPath: '/categories/women',
    imageUrl: 'https://picsum.photos/seed/bb-offer-glow/640/360',
    theme: 'DARK',
    sortOrder: 3,
  },
  {
    id: 'bb0f0000-0000-4000-8000-000000000004',
    title: 'Grooming for Grooms',
    subtitle: 'Sharp looks, delivered to your door.',
    ctaLabel: 'Explore now',
    targetPath: '/categories/groom',
    imageUrl: 'https://picsum.photos/seed/bb-offer-groom/640/360',
    theme: 'PRIMARY',
    sortOrder: 4,
  },
];

export { seedOffers };

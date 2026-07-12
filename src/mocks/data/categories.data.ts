import type { ServiceCategory } from '../../features/service-catalog/types/catalog';

/** Stable category IDs — referenced by services.data.ts (one-way dependency). */
const categoryIds = {
  men: 'bbca0000-0000-4000-8000-000000000001',
  women: 'bbca0000-0000-4000-8000-000000000002',
  kids: 'bbca0000-0000-4000-8000-000000000003',
  seniors: 'bbca0000-0000-4000-8000-000000000004',
  bride: 'bbca0000-0000-4000-8000-000000000005',
  groom: 'bbca0000-0000-4000-8000-000000000006',
} as const;

/**
 * serviceCount is intentionally omitted — it is derived from the seed services
 * at serve time (catalog.mock.ts) so the two files can never drift apart.
 */
type SeedCategory = Omit<ServiceCategory, 'serviceCount'>;

const seedCategories: SeedCategory[] = [
  {
    id: categoryIds.kids,
    name: 'Kids',
    slug: 'kids',
    description: 'Gentle, fun grooming for the little ones — right at your doorstep.',
    imageUrl: 'https://picsum.photos/seed/bb-cat-kids/600/450',
    heroImageUrl: 'https://picsum.photos/seed/bb-hero-kids/1200/600',
    sortOrder: 1,
  },
  {
    id: categoryIds.seniors,
    name: 'Seniors',
    slug: 'seniors',
    description: 'Comfort-first care and grooming tailored for senior citizens.',
    imageUrl: 'https://picsum.photos/seed/bb-cat-seniors/600/450',
    heroImageUrl: 'https://picsum.photos/seed/bb-hero-seniors/1200/600',
    sortOrder: 2,
  },
  {
    id: categoryIds.men,
    name: 'Men',
    slug: 'men',
    description: 'Haircuts, beard styling, facials and more — for men on the go.',
    imageUrl: 'https://picsum.photos/seed/bb-cat-men/600/450',
    heroImageUrl: 'https://picsum.photos/seed/bb-hero-men/1200/600',
    sortOrder: 3,
  },
  {
    id: categoryIds.women,
    name: 'Women',
    slug: 'women',
    description: 'Salon-quality hair, skin and nail care in the comfort of your home.',
    imageUrl: 'https://picsum.photos/seed/bb-cat-women/600/450',
    heroImageUrl: 'https://picsum.photos/seed/bb-hero-women/1200/600',
    sortOrder: 4,
  },
  {
    id: categoryIds.bride,
    name: 'Bride',
    slug: 'bride',
    description: 'Bridal glow packages, trials and pre-wedding pampering rituals.',
    imageUrl: 'https://picsum.photos/seed/bb-cat-bride/600/450',
    heroImageUrl: 'https://picsum.photos/seed/bb-hero-bride/1200/600',
    sortOrder: 5,
  },
  {
    id: categoryIds.groom,
    name: 'Groom',
    slug: 'groom',
    description: 'Look sharp on the big day — grooming packages made for grooms.',
    imageUrl: 'https://picsum.photos/seed/bb-cat-groom/600/450',
    heroImageUrl: 'https://picsum.photos/seed/bb-hero-groom/1200/600',
    sortOrder: 6,
  },
];

export { categoryIds, seedCategories };
export type { SeedCategory };

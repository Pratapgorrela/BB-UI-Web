import type { Testimonial } from '../../features/home/types/home';

/**
 * Seed featured testimonials for the Home "What Our Customers Say" carousel.
 * One entry has a null avatarUrl to exercise the Avatar initials fallback.
 */
const seedTestimonials: Testimonial[] = [
  {
    id: 'bb7e0000-0000-4000-8000-000000000001',
    authorName: 'Meenal R.',
    authorLocation: 'Madhapur',
    avatarUrl: 'https://picsum.photos/seed/bb-testi-meenal/96/96',
    rating: 5,
    quote:
      "Such a relaxing facial! I didn't expect home service to feel this professional. Highly recommended.",
    createdAt: '2026-06-20T09:30:00.000Z',
  },
  {
    id: 'bb7e0000-0000-4000-8000-000000000002',
    authorName: 'Arjun K.',
    authorLocation: 'Gachibowli',
    avatarUrl: null,
    rating: 5,
    quote:
      'Booked a haircut for my dad. The stylist was punctual and gentle — a brilliant experience.',
    createdAt: '2026-06-18T14:10:00.000Z',
  },
  {
    id: 'bb7e0000-0000-4000-8000-000000000003',
    authorName: 'Sneha T.',
    authorLocation: 'Kondapur',
    avatarUrl: 'https://picsum.photos/seed/bb-testi-sneha/96/96',
    rating: 4,
    quote: 'Loved the bridal trial. It saved me so much time before the wedding.',
    createdAt: '2026-06-15T11:45:00.000Z',
  },
  {
    id: 'bb7e0000-0000-4000-8000-000000000004',
    authorName: 'Rahul V.',
    authorLocation: 'Jubilee Hills',
    avatarUrl: 'https://picsum.photos/seed/bb-testi-rahul/96/96',
    rating: 5,
    quote: 'Quick, clean and convenient. The beard styling was on point.',
    createdAt: '2026-06-12T17:05:00.000Z',
  },
  {
    id: 'bb7e0000-0000-4000-8000-000000000005',
    authorName: 'Priya S.',
    authorLocation: 'Banjara Hills',
    avatarUrl: 'https://picsum.photos/seed/bb-testi-priya/96/96',
    rating: 5,
    quote: 'The team brought the whole salon to my living room. My skin is glowing!',
    createdAt: '2026-06-08T08:20:00.000Z',
  },
];

export { seedTestimonials };

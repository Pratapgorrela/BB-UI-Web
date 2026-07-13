import type { Specialist } from '../../features/booking/types/booking';
import { seedServices } from './services.data';

/** Stable specialist ID from a seed number (1..n). */
function spid(n: number): string {
  return `bb7a0000-0000-4000-8000-${String(n).padStart(12, '0')}`;
}

/** Service ids offered, by seed index — keeps references valid against the catalog seed. */
function servicesSlice(start: number, count: number): string[] {
  return seedServices.slice(start, start + count).map((service) => service.id);
}

/**
 * Seed specialists for system auto-assignment at booking creation (contract:
 * specialists are never client-selected). Consumed by the booking mock now;
 * F8 booking detail and F15 Track Van render them later.
 */
const seedSpecialists: Specialist[] = [
  {
    id: spid(1),
    firstName: 'Anita',
    lastName: 'Sharma',
    avatarUrl: 'https://picsum.photos/seed/bb-spec-1/200/200',
    bio: 'Senior bridal and occasion stylist with a decade of on-location experience.',
    specialties: ['Bridal Makeup', 'Hair Styling', 'Saree Draping'],
    rating: 4.9,
    reviewCount: 214,
    yearsOfExperience: 11,
    serviceIds: servicesSlice(0, 8),
  },
  {
    id: spid(2),
    firstName: 'Farhan',
    lastName: 'Khan',
    avatarUrl: 'https://picsum.photos/seed/bb-spec-2/200/200',
    bio: 'Men’s grooming expert — precision cuts, beard sculpting, and skin care.',
    specialties: ['Haircut', 'Beard Styling', 'Facial'],
    rating: 4.7,
    reviewCount: 168,
    yearsOfExperience: 8,
    serviceIds: servicesSlice(8, 8),
  },
  {
    id: spid(3),
    firstName: 'Lakshmi',
    lastName: 'Reddy',
    avatarUrl: 'https://picsum.photos/seed/bb-spec-3/200/200',
    bio: 'Gentle-touch stylist specialising in kids and senior clients at home.',
    specialties: ['Kids Haircut', 'Senior Care', 'Head Massage'],
    rating: 4.8,
    reviewCount: 142,
    yearsOfExperience: 9,
    serviceIds: servicesSlice(16, 8),
  },
  {
    id: spid(4),
    firstName: 'Priyanka',
    lastName: 'Das',
    avatarUrl: 'https://picsum.photos/seed/bb-spec-4/200/200',
    bio: 'Skin and nail specialist trained in salon-grade hygiene protocols.',
    specialties: ['Manicure', 'Pedicure', 'Waxing', 'Clean-up'],
    rating: 4.6,
    reviewCount: 121,
    yearsOfExperience: 6,
    serviceIds: servicesSlice(24, 8),
  },
];

export { seedSpecialists };

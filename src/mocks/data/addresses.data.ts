import type { Address } from '../../features/profile/types/address';

/**
 * Read-only seed addresses so the Saved Addresses screen is populated on first
 * login. Merged with the localStorage write store (`bb-mock-addresses`) at read
 * time by profile.mock — localStorage wins by id, so editing/deleting a seed
 * upserts the mutated copy there and this module is never mutated.
 *
 * Priya's first two ids intentionally match the retired interim `checkoutAddresses`
 * UUIDs (and the seed bookings' `addressId`s), so existing bookings still resolve
 * their address after F9 swaps checkout onto the real endpoint:
 *   - Home   (a1e7c9d2…) — referenced by Priya's PENDING seed booking → delete-blocked
 *   - Office (b2f8d0e3…) — referenced by Priya's CONFIRMED seed booking → delete-blocked
 *   - Parents' House      — referenced by nothing → freely deletable (demos happy-path delete)
 */

const PRIYA_USER_ID = '3f1c2a9e-8b4d-4c6a-9e2f-1a5b7c3d9e0f';
const RAHUL_USER_ID = '7d4e5f2b-1c8a-4b3d-8f6e-2c9a0b1d4e7f';

const seedAddresses: Address[] = [
  {
    id: 'a1e7c9d2-4b6f-4a1e-9c3d-7f2b8e5a1c40',
    userId: PRIYA_USER_ID,
    label: 'Home',
    street: '12 Jubilee Hills, Road No. 4',
    apartment: null,
    city: 'Hyderabad',
    state: 'Telangana',
    zipCode: '500033',
    country: 'IN',
    latitude: 17.4239,
    longitude: 78.4111,
    isDefault: true,
    createdAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'b2f8d0e3-5c7a-4b2f-8d4e-9a3c7f6b2d51',
    userId: PRIYA_USER_ID,
    label: 'Office',
    street: 'Tower B, Cyber Gateway, HITEC City',
    apartment: 'Floor 9',
    city: 'Hyderabad',
    state: 'Telangana',
    zipCode: '500081',
    country: 'IN',
    latitude: 17.4483,
    longitude: 78.3915,
    isDefault: false,
    createdAt: '2026-03-05T10:30:00.000Z',
  },
  {
    id: 'c3a9e1f4-6d8b-4c3a-9e5f-0b4d8a7c3e62',
    userId: PRIYA_USER_ID,
    label: "Parents' House",
    street: '48 Sainikpuri, Secunderabad',
    apartment: null,
    city: 'Hyderabad',
    state: 'Telangana',
    zipCode: '500094',
    country: 'IN',
    latitude: null,
    longitude: null,
    isDefault: false,
    createdAt: '2026-03-12T18:15:00.000Z',
  },
  {
    id: 'd4b0f2a5-7e9c-4d4b-8f60-1c5e9b8d4f73',
    userId: RAHUL_USER_ID,
    label: 'Home',
    street: '7 Banjara Hills, Road No. 12',
    apartment: 'Villa 3',
    city: 'Hyderabad',
    state: 'Telangana',
    zipCode: '500034',
    country: 'IN',
    latitude: 17.4126,
    longitude: 78.4482,
    isDefault: true,
    createdAt: '2026-03-08T12:00:00.000Z',
  },
];

export { seedAddresses };

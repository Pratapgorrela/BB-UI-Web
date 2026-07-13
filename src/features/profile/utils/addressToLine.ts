import type { Address } from '../types/address';

/**
 * Flatten an Address into a single display line, e.g.
 * "Flat 4B, 12 Jubilee Hills, Hyderabad, Telangana 500033".
 * Used by the checkout address selector and the booking-detail address card,
 * which both consume the compact `{ id, label, line }` shape.
 */
function addressToLine(address: Pick<Address, 'street' | 'apartment' | 'city' | 'state' | 'zipCode'>): string {
  const parts = [
    address.apartment,
    address.street,
    address.city,
    [address.state, address.zipCode].filter(Boolean).join(' '),
  ];
  return parts.filter((part) => part && part.trim()).join(', ');
}

export { addressToLine };

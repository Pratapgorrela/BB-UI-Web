/**
 * Address entity + request shapes for F9 (Profile & Addresses).
 * Mirrors the LOCKED `Address` contract entity field-for-field.
 */

interface Address {
  id: string;
  userId: string;
  label: string;
  street: string;
  apartment: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
  createdAt: string;
}

/** PATCH /profile — any subset of the editable User fields. */
interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

/** POST /addresses — the full editable address payload. */
interface CreateAddressRequest {
  label: string;
  street: string;
  apartment: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

/** PATCH /addresses/:id — partial update of any address field. */
type UpdateAddressRequest = Partial<CreateAddressRequest>;

export type { Address, CreateAddressRequest, UpdateAddressRequest, UpdateProfileRequest };

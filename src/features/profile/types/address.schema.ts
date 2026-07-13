import { z } from 'zod';

/** Reused from auth: E.164 international phone. */
const phoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{7,14}$/, 'Use international format, e.g. +919876543210');

/** 6-digit Indian PIN code. */
const zipCodeSchema = z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code');

/* ── Entity (contract parity) ── */

const addressSchema = z.object({
  id: z.string(),
  userId: z.string(),
  label: z.string(),
  street: z.string(),
  apartment: z.string().nullable(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  isDefault: z.boolean(),
  createdAt: z.string(),
});

/* ── Forms (RHF values) ── */

/**
 * Profile edit form. Email is immutable (it is the login key) so it is not
 * editable here.
 */
const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  phone: phoneSchema,
});

/**
 * Address add/edit form. `apartment` is a plain optional text field here
 * ('' when blank); the submit handler maps '' → null for the request body.
 */
const addressFormSchema = z.object({
  label: z.string().min(1, 'Label is required').max(30, 'Label is too long'),
  street: z.string().min(1, 'Street address is required').max(120, 'Street address is too long'),
  apartment: z.string().max(60, 'Apartment is too long'),
  city: z.string().min(1, 'City is required').max(60, 'City is too long'),
  state: z.string().min(1, 'State is required').max(60, 'State is too long'),
  zipCode: zipCodeSchema,
  country: z.string().min(2, 'Country is required').max(2, 'Use a 2-letter country code'),
  isDefault: z.boolean(),
});

/* ── Server request validation (mock handlers) ── */

const updateProfileRequestSchema = profileFormSchema.partial();

const createAddressRequestSchema = z.object({
  label: z.string().min(1).max(30),
  street: z.string().min(1).max(120),
  apartment: z.string().max(60).nullable(),
  city: z.string().min(1).max(60),
  state: z.string().min(1).max(60),
  zipCode: zipCodeSchema,
  country: z.string().length(2),
  isDefault: z.boolean(),
});

const updateAddressRequestSchema = createAddressRequestSchema.partial();

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type AddressFormValues = z.infer<typeof addressFormSchema>;

export {
  addressFormSchema,
  addressSchema,
  createAddressRequestSchema,
  profileFormSchema,
  updateAddressRequestSchema,
  updateProfileRequestSchema,
};
export type { AddressFormValues, ProfileFormValues };

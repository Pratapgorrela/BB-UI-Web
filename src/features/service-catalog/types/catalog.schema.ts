import { z } from 'zod';

const moneySchema = z.object({
  amount: z.number().int().nonnegative(),
  currency: z.string().length(3),
});

const serviceTypeSchema = z.enum(['COMBO', 'SINGLE']);

const serviceSortBySchema = z.enum(['price_asc', 'price_desc', 'rating', 'name']);

const serviceCategorySchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  imageUrl: z.string(),
  heroImageUrl: z.string(),
  serviceCount: z.number().int().nonnegative(),
  sortOrder: z.number().int(),
});

const serviceSchema = z.object({
  id: z.uuid(),
  categoryId: z.uuid(),
  type: serviceTypeSchema,
  name: z.string().min(1),
  description: z.string(),
  shortDescription: z.string().max(120),
  imageUrl: z.string(),
  galleryUrls: z.array(z.string()),
  price: moneySchema,
  originalPrice: moneySchema.nullable(),
  discountPercent: z.number().int().min(1).max(99).nullable(),
  includedServiceIds: z.array(z.uuid()),
  duration: z.number().int().positive(),
  isPopular: z.boolean(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  tags: z.array(z.string()),
  createdAt: z.iso.datetime(),
});

/**
 * Query-param schema for GET /services. Coercing — values arrive as strings
 * from URLSearchParams (both in the mock handler and page-level parsing).
 */
const serviceFiltersSchema = z.object({
  categoryId: z.uuid().optional(),
  type: serviceTypeSchema.optional(),
  search: z.string().max(200).optional(),
  isPopular: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  sortBy: serviceSortBySchema.optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

type ServiceFiltersInput = z.input<typeof serviceFiltersSchema>;

export {
  moneySchema,
  serviceCategorySchema,
  serviceFiltersSchema,
  serviceSchema,
  serviceSortBySchema,
  serviceTypeSchema,
};
export type { ServiceFiltersInput };

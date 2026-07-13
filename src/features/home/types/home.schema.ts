import { z } from 'zod';

const moneySchema = z.object({
  amount: z.number().int().nonnegative(),
  currency: z.string().length(3),
});

const offerThemeSchema = z.enum(['DARK', 'PRIMARY']);

const offerSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  subtitle: z.string(),
  ctaLabel: z.string().min(1),
  targetPath: z.string().min(1),
  imageUrl: z.string(),
  theme: offerThemeSchema,
  sortOrder: z.number().int(),
});

const testimonialSchema = z.object({
  id: z.uuid(),
  authorName: z.string().min(1),
  authorLocation: z.string(),
  avatarUrl: z.string().nullable(),
  rating: z.number().int().min(1).max(5),
  quote: z.string().min(1),
  createdAt: z.iso.datetime(),
});

const referralSchema = z.object({
  code: z.string().min(1),
  referrerReward: moneySchema,
  refereeDiscount: moneySchema,
});

export { moneySchema, offerSchema, offerThemeSchema, referralSchema, testimonialSchema };

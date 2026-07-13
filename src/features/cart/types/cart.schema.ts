import { z } from 'zod';
import { moneySchema, serviceSchema } from '../../service-catalog/types/catalog.schema';

const couponDiscountTypeSchema = z.enum(['PERCENT', 'FLAT']);

const couponSchema = z.object({
  code: z.string().min(1),
  label: z.string().min(1),
  description: z.string(),
  discountType: couponDiscountTypeSchema,
  discountValue: z.number().int().positive(),
  minSubtotal: moneySchema.nullable(),
  maxDiscount: moneySchema.nullable(),
});

const cartItemSchema = z.object({
  serviceId: z.uuid(),
  service: serviceSchema,
  quantity: z.number().int().min(1),
  selected: z.boolean(),
  lineTotal: moneySchema,
});

const paymentSummarySchema = z.object({
  serviceCharges: moneySchema,
  discount: moneySchema,
  taxes: moneySchema,
  total: moneySchema,
  appliedCoupon: couponSchema.nullable(),
  taxRatePercent: z.number().int().nonnegative(),
});

const orderSchema = z.object({
  id: z.uuid(),
  referenceCode: z.string().min(1),
  items: z.array(cartItemSchema),
  paymentSummary: paymentSummarySchema,
  addressId: z.uuid(),
  status: z.literal('PLACED'),
  createdAt: z.iso.datetime(),
});

/* ── Request schemas (validate handler bodies) ── */

const cartLineInputSchema = z.object({
  serviceId: z.uuid(),
  quantity: z.coerce.number().int().min(1).max(20),
});

const checkoutSummaryRequestSchema = z.object({
  items: z.array(cartLineInputSchema).min(1),
  couponCode: z.string().trim().min(1).nullable().optional(),
});

const placeOrderRequestSchema = checkoutSummaryRequestSchema.extend({
  addressId: z.uuid(),
});

export {
  cartItemSchema,
  cartLineInputSchema,
  checkoutSummaryRequestSchema,
  couponDiscountTypeSchema,
  couponSchema,
  orderSchema,
  paymentSummarySchema,
  placeOrderRequestSchema,
};

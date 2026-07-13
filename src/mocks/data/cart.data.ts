import type { Coupon } from '../../features/cart/types/cart';

const inr = (amount: number) => ({ amount, currency: 'INR' });

/**
 * Curated checkout coupons. Amounts in minor units (paise).
 * - SAVE20   — 20% off, needs ₹999+, capped at ₹300 (exercises the maxDiscount cap)
 * - FLAT100  — flat ₹100 off, no minimum
 * - WELCOME15 — 15% off, no minimum, uncapped
 * - BIG50    — 50% off but needs ₹5,000+ (exercises the minSubtotal 422 gate on small carts)
 */
const seedCoupons: Coupon[] = [
  {
    code: 'SAVE20',
    label: '20% off',
    description: '20% off orders above ₹999 (up to ₹300 off)',
    discountType: 'PERCENT',
    discountValue: 20,
    minSubtotal: inr(99900),
    maxDiscount: inr(30000),
  },
  {
    code: 'FLAT100',
    label: '₹100 off',
    description: 'Flat ₹100 off your order',
    discountType: 'FLAT',
    discountValue: 10000,
    minSubtotal: null,
    maxDiscount: null,
  },
  {
    code: 'WELCOME15',
    label: '15% off',
    description: '15% off your first booking',
    discountType: 'PERCENT',
    discountValue: 15,
    minSubtotal: null,
    maxDiscount: null,
  },
  {
    code: 'BIG50',
    label: '50% off',
    description: '50% off orders above ₹5,000',
    discountType: 'PERCENT',
    discountValue: 50,
    minSubtotal: inr(500000),
    maxDiscount: null,
  },
];

export { seedCoupons };

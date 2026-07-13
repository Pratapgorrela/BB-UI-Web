import { describe, expect, it } from 'vitest';
import axios, { isAxiosError } from 'axios';
import { mockAdapter } from '../lib/mockEngine';
import './cart.mock';
import { seedCoupons } from '../data/cart.data';
import { seedServices } from '../data/services.data';
import { couponSchema, paymentSummarySchema } from '../../features/cart/types/cart.schema';
import type { Coupon, PaymentSummary } from '../../features/cart/types/cart';
import type { ApiFailure, ApiSuccess } from '../../types/api';

// Requests go through the real mock adapter — the exact path the app uses.
const client = axios.create({ adapter: mockAdapter });

const TAX_RATE = 18;

// Use the highest-priced service so coupon thresholds are reachable within the qty cap (20).
const service = seedServices.reduce((max, candidate) =>
  candidate.price.amount > max.price.amount ? candidate : max,
);

async function expectApiError(promise: Promise<unknown>, status: number, code: string) {
  try {
    await promise;
    expect.unreachable('expected request to fail');
  } catch (error) {
    if (!isAxiosError(error)) throw error;
    expect(error.response?.status).toBe(status);
    const body = error.response?.data as ApiFailure;
    expect(body.success).toBe(false);
    expect(body.error.code).toBe(code);
  }
}

describe('seed data integrity', () => {
  it('every seed coupon satisfies the contract schema', () => {
    for (const coupon of seedCoupons) {
      expect(() => couponSchema.parse(coupon)).not.toThrow();
    }
  });

  it('includes a min-subtotal coupon and a capped percent coupon', () => {
    expect(seedCoupons.some((c) => c.minSubtotal !== null)).toBe(true);
    expect(seedCoupons.some((c) => c.discountType === 'PERCENT' && c.maxDiscount !== null)).toBe(true);
  });
});

describe('GET /coupons', () => {
  it('returns all coupons in a single-resource envelope', async () => {
    const response = await client.get<ApiSuccess<Coupon[]>>('/coupons');
    expect(response.data.success).toBe(true);
    expect(response.data.data).toHaveLength(seedCoupons.length);
  });

  it('scenario=empty returns an empty list', async () => {
    const response = await client.get<ApiSuccess<Coupon[]>>('/coupons', {
      params: { scenario: 'empty' },
    });
    expect(response.data.data).toHaveLength(0);
  });

  it('scenario=error returns the simulated server error', async () => {
    await expectApiError(client.get('/coupons', { params: { scenario: 'error' } }), 500, 'INTERNAL_ERROR');
  });
});

describe('POST /checkout/summary', () => {
  it('computes charges + 18% tax with no coupon', async () => {
    const response = await client.post<ApiSuccess<PaymentSummary>>('/checkout/summary', {
      items: [{ serviceId: service.id, quantity: 1 }],
    });
    const summary = response.data.data;
    expect(() => paymentSummarySchema.parse(summary)).not.toThrow();

    const sc = service.price.amount;
    expect(summary.serviceCharges.amount).toBe(sc);
    expect(summary.discount.amount).toBe(0);
    expect(summary.appliedCoupon).toBeNull();
    expect(summary.taxRatePercent).toBe(TAX_RATE);
    expect(summary.taxes.amount).toBe(Math.round(sc * (TAX_RATE / 100)));
    expect(summary.total.amount).toBe(sc + summary.taxes.amount);
  });

  it('applies a FLAT coupon (₹100 off)', async () => {
    const response = await client.post<ApiSuccess<PaymentSummary>>('/checkout/summary', {
      items: [{ serviceId: service.id, quantity: 1 }],
      couponCode: 'FLAT100',
    });
    const summary = response.data.data;
    const expectedDiscount = Math.min(10000, service.price.amount);
    expect(summary.discount.amount).toBe(expectedDiscount);
    expect(summary.appliedCoupon?.code).toBe('FLAT100');
    const taxable = summary.serviceCharges.amount - expectedDiscount;
    expect(summary.taxes.amount).toBe(Math.round(taxable * (TAX_RATE / 100)));
    expect(summary.total.amount).toBe(taxable + summary.taxes.amount);
  });

  it('caps a PERCENT coupon at maxDiscount (SAVE20)', async () => {
    // Reach ≥ ₹1,500 so 20% ≥ the ₹300 cap.
    const quantity = Math.max(1, Math.ceil(150000 / service.price.amount));
    const response = await client.post<ApiSuccess<PaymentSummary>>('/checkout/summary', {
      items: [{ serviceId: service.id, quantity }],
      couponCode: 'SAVE20',
    });
    const summary = response.data.data;
    const sc = service.price.amount * quantity;
    const expectedDiscount = Math.min(Math.floor(sc * 0.2), 30000);
    expect(summary.serviceCharges.amount).toBe(sc);
    expect(summary.discount.amount).toBe(expectedDiscount);
    expect(summary.discount.amount).toBe(30000); // cap hit
    expect(summary.appliedCoupon?.code).toBe('SAVE20');
  });

  it('rejects a coupon whose minSubtotal is not met (BIG50) with 422', async () => {
    await expectApiError(
      client.post('/checkout/summary', {
        items: [{ serviceId: service.id, quantity: 1 }],
        couponCode: 'BIG50',
      }),
      422,
      'BUSINESS_RULE_VIOLATION',
    );
  });

  it('rejects an unknown coupon code with 400', async () => {
    await expectApiError(
      client.post('/checkout/summary', {
        items: [{ serviceId: service.id, quantity: 1 }],
        couponCode: 'DOESNOTEXIST',
      }),
      400,
      'VALIDATION_ERROR',
    );
  });

  it('rejects an unknown serviceId with 400', async () => {
    await expectApiError(
      client.post('/checkout/summary', {
        items: [{ serviceId: '00000000-0000-4000-8000-000000000000', quantity: 1 }],
      }),
      400,
      'VALIDATION_ERROR',
    );
  });

  it('rejects an empty items array with 400', async () => {
    await expectApiError(client.post('/checkout/summary', { items: [] }), 400, 'VALIDATION_ERROR');
  });
});

// POST /orders was superseded by POST /bookings — coverage lives in booking.mock.test.ts.

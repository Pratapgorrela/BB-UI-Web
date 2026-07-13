import { fail, MockError, ok, registerMock } from '../lib/mockEngine';
import { requireAuth } from '../lib/guards';
import { seedCoupons } from '../data/cart.data';
import { seedServices } from '../data/services.data';
import {
  checkoutSummaryRequestSchema,
  placeOrderRequestSchema,
} from '../../features/cart/types/cart.schema';
import type {
  CartItem,
  CartLineInput,
  Coupon,
  Order,
  PaymentSummary,
} from '../../features/cart/types/cart';
import type { ApiErrorDetail } from '../../types/api';

const TAX_RATE_PERCENT = 18;

function toValidationDetails(issues: { path: PropertyKey[]; message: string }[]): ApiErrorDetail[] {
  return issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }));
}

function rupees(minor: number): string {
  return `₹${(minor / 100).toLocaleString('en-IN')}`;
}

function computeDiscount(coupon: Coupon, serviceCharges: number): number {
  let discount =
    coupon.discountType === 'PERCENT'
      ? Math.floor((serviceCharges * coupon.discountValue) / 100)
      : coupon.discountValue;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount.amount);
  return Math.min(discount, serviceCharges);
}

/**
 * Server-authoritative price computation shared by /checkout/summary and /orders.
 * Throws `MockError` on validation (400) / business-rule (422) failures.
 */
function priceCart(
  items: CartLineInput[],
  couponCode: string | null | undefined,
  path: string,
): PaymentSummary {
  let serviceCharges = 0;
  let currency = 'INR';

  for (const line of items) {
    const service = seedServices.find((candidate) => candidate.id === line.serviceId);
    if (!service) {
      throw new MockError(
        fail(400, 'VALIDATION_ERROR', 'Your cart contains an unknown service.', path, [
          { field: 'items', message: `Service ${line.serviceId} does not exist.` },
        ]),
      );
    }
    currency = service.price.currency;
    serviceCharges += service.price.amount * line.quantity;
  }

  let appliedCoupon: Coupon | null = null;
  let discount = 0;

  if (couponCode) {
    const coupon = seedCoupons.find((candidate) => candidate.code === couponCode.toUpperCase());
    if (!coupon) {
      throw new MockError(
        fail(400, 'VALIDATION_ERROR', 'That coupon code is not valid.', path, [
          { field: 'couponCode', message: 'Enter a valid coupon code.' },
        ]),
      );
    }
    if (coupon.minSubtotal && serviceCharges < coupon.minSubtotal.amount) {
      throw new MockError(
        fail(
          422,
          'BUSINESS_RULE_VIOLATION',
          `Add items worth ${rupees(coupon.minSubtotal.amount)} or more to use ${coupon.code}.`,
          path,
          [
            {
              field: 'couponCode',
              message: `Minimum order of ${rupees(coupon.minSubtotal.amount)} required.`,
            },
          ],
        ),
      );
    }
    discount = computeDiscount(coupon, serviceCharges);
    appliedCoupon = coupon;
  }

  const taxable = serviceCharges - discount;
  const taxes = Math.round((taxable * TAX_RATE_PERCENT) / 100);
  const total = taxable + taxes;

  return {
    serviceCharges: { amount: serviceCharges, currency },
    discount: { amount: discount, currency },
    taxes: { amount: taxes, currency },
    total: { amount: total, currency },
    appliedCoupon,
    taxRatePercent: TAX_RATE_PERCENT,
  };
}

function makeReferenceCode(): string {
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}${String(
    now.getUTCDate(),
  ).padStart(2, '0')}`;
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 4).toUpperCase();
  return `BB-${stamp}-${suffix}`;
}

/* ── GET /coupons ── */

registerMock('GET', '/coupons', (req) => {
  const path = '/api/v1/coupons';
  const scenario = req.query.get('scenario');
  if (scenario === 'error') {
    return fail(500, 'INTERNAL_ERROR', 'Simulated server error. Please try again later.', path);
  }
  if (scenario === 'empty') return ok([]);
  return ok(seedCoupons);
});

/* ── POST /checkout/summary ── */

registerMock('POST', '/checkout/summary', (req) => {
  const path = '/api/v1/checkout/summary';
  const parsed = checkoutSummaryRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(
      400,
      'VALIDATION_ERROR',
      'Request validation failed.',
      path,
      toValidationDetails(parsed.error.issues),
    );
  }
  return ok(priceCart(parsed.data.items, parsed.data.couponCode, path));
});

/* ── POST /orders ── */

registerMock('POST', '/orders', (req) => {
  const path = '/api/v1/orders';
  requireAuth(req, path);

  const parsed = placeOrderRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(
      400,
      'VALIDATION_ERROR',
      'Request validation failed.',
      path,
      toValidationDetails(parsed.error.issues),
    );
  }

  const { items, couponCode, addressId } = parsed.data;
  const paymentSummary = priceCart(items, couponCode, path);

  // priceCart already validated every serviceId exists, so the lookups below are safe.
  const orderItems: CartItem[] = items.map((line) => {
    const service = seedServices.find((candidate) => candidate.id === line.serviceId)!;
    return {
      serviceId: service.id,
      service,
      quantity: line.quantity,
      selected: true,
      lineTotal: { amount: service.price.amount * line.quantity, currency: service.price.currency },
    };
  });

  const order: Order = {
    id: crypto.randomUUID(),
    referenceCode: makeReferenceCode(),
    items: orderItems,
    paymentSummary,
    addressId,
    status: 'PLACED',
    createdAt: new Date().toISOString(),
  };

  return ok(order, 201);
});

// Shared with booking.mock — POST /bookings prices its payload exactly like /checkout/summary.
export { makeReferenceCode, priceCart, toValidationDetails };

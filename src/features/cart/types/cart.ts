import type { Money } from '../../../types/common';
import type { Service } from '../../service-catalog/types/catalog';

type CouponDiscountType = 'PERCENT' | 'FLAT';

type OrderStatus = 'PLACED';

/**
 * A single line in the cart. The cart lives in client state (`useCartStore`,
 * persisted) — this is the shape held per line. `service` is an expanded
 * snapshot so the cart renders without re-fetching.
 */
interface CartItem {
  serviceId: string;
  service: Service;
  quantity: number;
  selected: boolean;
  lineTotal: Money;
}

interface Coupon {
  code: string;
  label: string;
  description: string;
  discountType: CouponDiscountType;
  /** PERCENT: whole percent (e.g. 20). FLAT: amount in minor units (paise). */
  discountValue: number;
  minSubtotal: Money | null;
  maxDiscount: Money | null;
}

interface PaymentSummary {
  serviceCharges: Money;
  discount: Money;
  taxes: Money;
  total: Money;
  appliedCoupon: Coupon | null;
  taxRatePercent: number;
}

interface Order {
  id: string;
  referenceCode: string;
  items: CartItem[];
  paymentSummary: PaymentSummary;
  addressId: string;
  status: OrderStatus;
  createdAt: string;
}

/** The minimal per-line payload the client sends to pricing/order endpoints. */
interface CartLineInput {
  serviceId: string;
  quantity: number;
}

interface CheckoutSummaryRequest {
  items: CartLineInput[];
  couponCode?: string | null;
}

interface PlaceOrderRequest extends CheckoutSummaryRequest {
  addressId: string;
}

export type {
  CartItem,
  CartLineInput,
  CheckoutSummaryRequest,
  Coupon,
  CouponDiscountType,
  Order,
  OrderStatus,
  PaymentSummary,
  PlaceOrderRequest,
};

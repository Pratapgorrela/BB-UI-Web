import type { Money } from '../types/common';

const currencySymbols: Record<string, string> = {
  INR: '₹',
};

/** `{ amount: 39900, currency: 'INR' }` → `₹399` (amount is in minor units). */
function formatPrice(money: Money): string {
  const symbol = currencySymbols[money.currency] ?? `${money.currency} `;
  const value = money.amount / 100;
  return `${symbol}${value.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  })}`;
}

/** `90` → `1 hr 30 min`, `45` → `45 min`. */
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}

export { formatDuration, formatPrice };

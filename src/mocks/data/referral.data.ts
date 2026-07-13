import type { Referral } from '../../features/home/types/home';

/** `100` → `{ amount: 10000, currency: 'INR' }` (minor units). */
const inr = (rupees: number) => ({ amount: rupees * 100, currency: 'INR' });

/** Single referral reward record for the Home "Share the Beauty, Get Rewarded" card. */
const seedReferral: Referral = {
  code: 'BEAUTY100',
  referrerReward: inr(100),
  refereeDiscount: inr(100),
};

export { seedReferral };

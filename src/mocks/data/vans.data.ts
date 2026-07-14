import type { Van } from '../../features/booking/types/booking';

/**
 * Seed vans for deterministic system assignment on the Track Van screen —
 * vans are never client-selected (mirrors the specialists seed). tracking.mock
 * picks one per booking by hashing the booking id, so the same booking always
 * shows the same van + driver.
 */
const seedVans: Van[] = [
  {
    vanCode: 'BB-VAN-01',
    vehicleNumber: 'TS 09 EA 1184',
    driverName: 'Ravi Kumar',
    driverPhone: '+919812340001',
  },
  {
    vanCode: 'BB-VAN-02',
    vehicleNumber: 'TS 09 EB 4721',
    driverName: 'Suresh Babu',
    driverPhone: '+919812340002',
  },
  {
    vanCode: 'BB-VAN-03',
    vehicleNumber: 'TS 10 EC 0937',
    driverName: 'Mahesh Goud',
    driverPhone: '+919812340003',
  },
  {
    vanCode: 'BB-VAN-04',
    vehicleNumber: 'TS 11 ED 5560',
    driverName: 'Imran Ali',
    driverPhone: '+919812340004',
  },
];

export { seedVans };

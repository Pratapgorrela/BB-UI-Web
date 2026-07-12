import type { User } from '../../features/auth/types/auth';

interface MockUserRecord {
  user: User;
  password: string;
}

const seedUsers: MockUserRecord[] = [
  {
    user: {
      id: '3f1c2a9e-8b4d-4c6a-9e2f-1a5b7c3d9e0f',
      email: 'priya@example.com',
      firstName: 'Priya',
      lastName: 'Sharma',
      phone: '+919876543210',
      avatarUrl: null,
      role: 'CUSTOMER',
      createdAt: '2026-01-15T09:30:00.000Z',
      updatedAt: '2026-01-15T09:30:00.000Z',
    },
    password: 'Priya@123',
  },
  {
    user: {
      id: '7d4e5f2b-1c8a-4b3d-8f6e-2c9a0b1d4e7f',
      email: 'rahul@example.com',
      firstName: 'Rahul',
      lastName: 'Verma',
      phone: '+919812345678',
      avatarUrl: null,
      role: 'CUSTOMER',
      createdAt: '2026-02-20T14:00:00.000Z',
      updatedAt: '2026-02-20T14:00:00.000Z',
    },
    password: 'Rahul@123',
  },
];

export { seedUsers };
export type { MockUserRecord };

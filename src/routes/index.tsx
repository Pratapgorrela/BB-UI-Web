import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('../pages/HomePage'),
  },
  {
    path: '/services',
    lazy: () => import('../pages/ServiceCatalogPage'),
  },
  {
    path: '/services/:id',
    lazy: () => import('../pages/ServiceDetailPage'),
  },
  {
    path: '/login',
    lazy: () => import('../pages/LoginPage'),
  },
  {
    path: '/register',
    lazy: () => import('../pages/RegisterPage'),
  },
  {
    path: '/bookings',
    lazy: () => import('../pages/MyBookingsPage'),
  },
  {
    path: '/bookings/:id',
    lazy: () => import('../pages/BookingDetailPage'),
  },
  {
    path: '/book',
    lazy: () => import('../pages/BookingFlowPage'),
  },
  {
    path: '/profile',
    lazy: () => import('../pages/ProfilePage'),
  },
  {
    path: '/notifications',
    lazy: () => import('../pages/NotificationsPage'),
  },
]);

export default router;

import { createBrowserRouter } from 'react-router-dom';
import { AppShell, type AppRouteHandle } from '../components/layout';

const router = createBrowserRouter([
  {
    element: <AppShell />,
    hydrateFallbackElement: <div className="min-h-dvh bg-neutral-100" />,
    children: [
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
        handle: { hideNav: true } satisfies AppRouteHandle,
      },
      {
        path: '/register',
        lazy: () => import('../pages/RegisterPage'),
        handle: { hideNav: true } satisfies AppRouteHandle,
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
      {
        path: '/dev/components',
        lazy: () => import('../pages/DevComponentsPage'),
        handle: { hideNav: true, fullBleed: true } satisfies AppRouteHandle,
      },
    ],
  },
]);

export default router;

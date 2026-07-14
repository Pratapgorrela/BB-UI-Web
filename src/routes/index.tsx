import { createBrowserRouter } from 'react-router-dom';
import { AppShell, type AppRouteHandle } from '../components/layout';
import { ProtectedRoute } from './ProtectedRoute';

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
        path: '/search',
        lazy: () => import('../pages/SearchPage'),
        handle: { hideNav: true } satisfies AppRouteHandle,
      },
      {
        path: '/services/:id',
        lazy: () => import('../pages/ServiceDetailPage'),
        handle: { hideNav: true, fullBleed: true } satisfies AppRouteHandle,
      },
      {
        path: '/categories/:slug',
        lazy: () => import('../pages/CategoryDetailPage'),
        handle: { hideNav: true, fullBleed: true } satisfies AppRouteHandle,
      },
      {
        path: '/cart',
        lazy: () => import('../pages/CartPage'),
        handle: { hideNav: true, fullBleed: true } satisfies AppRouteHandle,
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
        element: <ProtectedRoute />,
        children: [
          {
            path: '/bookings',
            lazy: () => import('../pages/MyBookingsPage'),
          },
          {
            path: '/bookings/:id',
            lazy: () => import('../pages/BookingDetailPage'),
          },
          {
            path: '/bookings/:id/track',
            lazy: () => import('../pages/TrackVanPage'),
            handle: { hideNav: true } satisfies AppRouteHandle,
          },
          {
            path: '/profile',
            lazy: () => import('../pages/ProfilePage'),
          },
          {
            path: '/profile/addresses',
            lazy: () => import('../pages/SavedAddressesPage'),
          },
          {
            path: '/notifications',
            lazy: () => import('../pages/AlertsPage'),
          },
          {
            path: '/notifications/settings',
            lazy: () => import('../pages/NotificationSettingsPage'),
          },
          {
            path: '/checkout',
            lazy: () => import('../pages/CheckoutPage'),
            handle: { hideNav: true, fullBleed: true } satisfies AppRouteHandle,
          },
          {
            path: '/booking-confirmation',
            lazy: () => import('../pages/BookingConfirmationPage'),
            handle: { hideNav: true, fullBleed: true } satisfies AppRouteHandle,
          },
        ],
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

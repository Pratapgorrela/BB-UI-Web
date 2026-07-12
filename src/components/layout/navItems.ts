import { Bell, CalendarDays, Home, Sparkles, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/services', label: 'Services', icon: Sparkles },
  { to: '/bookings', label: 'Bookings', icon: CalendarDays },
  { to: '/notifications', label: 'Alerts', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
];

export { NAV_ITEMS };
export type { NavItem };

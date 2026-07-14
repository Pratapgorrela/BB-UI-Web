import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  CalendarCheck,
  ChevronRight,
  FileText,
  HelpCircle,
  LogOut,
  MapPin,
  Pencil,
  type LucideIcon,
} from 'lucide-react';
import { Avatar, Button, Card, DataState, useToast } from '../components/ui';
import { useLogoutUser } from '../features/auth';
import { ProfileEditSheet, useFetchProfile, useUpdateProfile } from '../features/profile';

interface MenuLink {
  label: string;
  icon: LucideIcon;
  to?: string;
  soon?: string;
}

const MENU_LINKS: MenuLink[] = [
  { label: 'My bookings', icon: CalendarCheck, to: '/bookings' },
  { label: 'Saved addresses', icon: MapPin, to: '/profile/addresses' },
  { label: 'Notifications', icon: Bell, to: '/notifications' },
  { label: 'Help & support', icon: HelpCircle, to: '/help' },
  { label: 'Terms & policies', icon: FileText, soon: 'Terms & policies are coming soon.' },
];

export function Component() {
  const profile = useFetchProfile();
  const logout = useLogoutUser();
  const updateProfile = useUpdateProfile();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  return (
    <div className="py-6">
      <h1 className="font-heading text-h2 font-bold text-neutral-800">Profile</h1>

      <div className="mt-4 flex max-w-xl flex-col gap-4">
        <DataState
          data={profile.data}
          isLoading={profile.isLoading}
          error={profile.error}
          onRetry={() => void profile.refetch()}
        >
          {(user) => (
            <>
              <Card variant="raised" padding="lg">
                <div className="flex items-center gap-4">
                  <Avatar size="lg" name={`${user.firstName} ${user.lastName}`} src={user.avatarUrl ?? undefined} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-lg font-semibold text-neutral-800">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="truncate text-body-sm text-neutral-500">{user.email}</p>
                    <p className="text-body-sm text-neutral-500">{user.phone}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Pencil size={16} aria-hidden="true" />}
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </Button>
                </div>
              </Card>

              <Card variant="default" padding="none">
                <ul className="divide-y divide-neutral-200">
                  {MENU_LINKS.map(({ label, icon: Icon, to, soon }) => {
                    const inner = (
                      <>
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                          <Icon size={18} aria-hidden="true" />
                        </span>
                        <span className="flex-1 text-body font-medium text-neutral-800">{label}</span>
                        <ChevronRight size={18} className="text-neutral-400" aria-hidden="true" />
                      </>
                    );
                    const rowClass =
                      'flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-fast hover:bg-neutral-100 focus-visible:shadow-focus focus-visible:outline-none';
                    return (
                      <li key={label}>
                        {to ? (
                          <Link to={to} className={rowClass}>
                            {inner}
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className={rowClass}
                            onClick={() => soon && addToast(soon, 'info')}
                          >
                            {inner}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Card>

              <Button
                variant="outline"
                fullWidth
                leftIcon={<LogOut size={18} aria-hidden="true" />}
                onClick={() => logout.mutate(undefined, { onSuccess: () => navigate('/') })}
                loading={logout.isPending}
              >
                Log out
              </Button>

              <ProfileEditSheet
                open={editing}
                onClose={() => setEditing(false)}
                user={user}
                isPending={updateProfile.isPending}
                onSubmit={(values) =>
                  updateProfile.mutate(values, { onSuccess: () => setEditing(false) })
                }
              />
            </>
          )}
        </DataState>
      </div>
    </div>
  );
}

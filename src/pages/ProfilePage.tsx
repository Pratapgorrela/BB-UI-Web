import { LogOut } from 'lucide-react';
import { Avatar, Button, Card, DataState } from '../components/ui';
import { useFetchCurrentUser, useLogoutUser } from '../features/auth';

export function Component() {
  const currentUser = useFetchCurrentUser();
  const logout = useLogoutUser();

  return (
    <div className="py-6">
      <h1 className="font-heading text-h1 font-bold text-neutral-800">Profile</h1>
      <div className="mt-4 max-w-md">
        <DataState
          data={currentUser.data}
          isLoading={currentUser.isLoading}
          error={currentUser.error}
          onRetry={() => void currentUser.refetch()}
        >
          {(user) => (
            <Card variant="raised" padding="lg">
              <div className="flex items-center gap-4">
                <Avatar size="lg" name={`${user.firstName} ${user.lastName}`} />
                <div className="min-w-0">
                  <p className="truncate text-body font-semibold text-neutral-800">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-body-sm text-neutral-500">{user.email}</p>
                  <p className="text-body-sm text-neutral-500">{user.phone}</p>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  variant="outline"
                  leftIcon={<LogOut size={18} aria-hidden="true" />}
                  onClick={() => logout.mutate()}
                  loading={logout.isPending}
                >
                  Log out
                </Button>
              </div>
            </Card>
          )}
        </DataState>
      </div>
    </div>
  );
}

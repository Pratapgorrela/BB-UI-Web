import { Outlet, ScrollRestoration, useMatches } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Container } from './Container';
import { TopNav } from './TopNav';

interface AppRouteHandle {
  hideNav?: boolean;
  fullBleed?: boolean;
}

function AppShell() {
  const matches = useMatches();
  const handle = matches.reduce<AppRouteHandle>(
    (acc, match) => ({ ...acc, ...(match.handle as AppRouteHandle | undefined) }),
    {},
  );

  return (
    <div className="flex min-h-dvh flex-col">
      {!handle.hideNav && <TopNav />}
      <main
        className={
          handle.hideNav
            ? 'flex-1'
            : 'flex-1 pb-[calc(var(--height-bottom-nav)+env(safe-area-inset-bottom))] md:pb-0'
        }
      >
        {handle.fullBleed ? (
          <Outlet />
        ) : (
          <Container>
            <Outlet />
          </Container>
        )}
      </main>
      {!handle.hideNav && <BottomNav />}
      <ScrollRestoration />
    </div>
  );
}

export { AppShell };
export type { AppRouteHandle };

import { useEffect } from 'react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button, Card } from '../ui';

/**
 * Route-level error boundary (React Router `errorElement`): catches render
 * errors, loader failures and chunk-load errors anywhere in the route tree
 * and shows a recoverable fallback instead of a white screen.
 */
function RouteErrorBoundary() {
  const error = useRouteError();

  useEffect(() => {
    console.error('[ErrorBoundary] Route error caught:', error);
  }, [error]);

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'An unexpected error occurred.';

  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-100 px-4">
      <Card variant="raised" padding="lg" className="w-full max-w-md text-center">
        <div className="flex flex-col items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-full bg-danger-100">
            <AlertTriangle size={28} className="text-danger-500" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-heading text-h3 font-bold text-neutral-900">
              Something went wrong
            </h1>
            <p className="mt-2 text-body-sm text-neutral-600">
              Sorry about that — the page hit an unexpected error. Reloading usually fixes it.
            </p>
            <p className="mt-2 break-words font-mono text-caption text-neutral-400">{message}</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try again
            </Button>
            <Link to="/" reloadDocument>
              <Button variant="secondary" fullWidth>
                Go home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export { RouteErrorBoundary };

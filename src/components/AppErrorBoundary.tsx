import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  message: string | null;
}

/**
 * Last-resort boundary above the router (providers, router setup). Router-tree
 * errors are handled by RouteErrorBoundary; this catches anything outside it
 * so the user never sees a blank page. Class component by necessity — React
 * has no hook equivalent of componentDidCatch.
 */
class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false, message: null };

  static getDerivedStateFromError(error: unknown): AppErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    console.error('[ErrorBoundary] App crashed:', error, info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    // Deliberately token-styled but framework-light: if the app shell itself
    // is broken, the less this fallback depends on, the better.
    return (
      <div className="flex min-h-dvh items-center justify-center bg-neutral-100 px-4">
        <div className="w-full max-w-md rounded-lg bg-neutral-0 p-6 text-center shadow-md">
          <h1 className="font-heading text-h3 font-bold text-neutral-900">Something went wrong</h1>
          <p className="mt-2 text-body-sm text-neutral-600">
            The app hit an unexpected error. Please reload to continue.
          </p>
          {this.state.message && (
            <p className="mt-2 break-words font-mono text-caption text-neutral-400">
              {this.state.message}
            </p>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex h-11 items-center justify-center rounded-md bg-primary-500 px-6 text-body font-medium text-neutral-0 transition-colors duration-fast hover:bg-primary-600 focus-visible:shadow-focus focus-visible:outline-none"
          >
            Reload app
          </button>
        </div>
      </div>
    );
  }
}

export { AppErrorBoundary };

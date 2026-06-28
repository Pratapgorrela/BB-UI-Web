import { type ReactNode } from 'react';
import { AlertCircle, Inbox } from 'lucide-react';
import { Button } from './Button';
import { SkeletonCard } from './Skeleton';

interface DataStateProps<T> {
  data: T | undefined | null;
  isLoading: boolean;
  error: Error | null;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  emptyCta?: { label: string; onClick: () => void };
  onRetry?: () => void;
  skeleton?: ReactNode;
  skeletonCount?: number;
  isEmpty?: (data: T) => boolean;
  children: (data: T) => ReactNode;
}

function DataState<T>({
  data,
  isLoading,
  error,
  emptyMessage = 'Nothing here yet',
  emptyIcon,
  emptyCta,
  onRetry,
  skeleton,
  skeletonCount = 3,
  isEmpty,
  children,
}: DataStateProps<T>) {
  /* Loading */
  if (isLoading) {
    if (skeleton) return <>{skeleton}</>;
    return (
      <div className="space-y-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-4">
        <AlertCircle size={48} className="text-danger-400" />
        <div>
          <p className="text-body font-medium text-neutral-800">Something went wrong</p>
          <p className="text-body-sm text-neutral-500 mt-1">{error.message}</p>
        </div>
        {onRetry && (
          <Button variant="primary" size="sm" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    );
  }

  /* Empty */
  const dataIsEmpty =
    data == null ||
    (isEmpty ? isEmpty(data) : Array.isArray(data) && data.length === 0);

  if (dataIsEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-4">
        {emptyIcon ?? <Inbox size={48} className="text-neutral-400" />}
        <p className="text-body text-neutral-500">{emptyMessage}</p>
        {emptyCta && (
          <Button variant="primary" size="sm" onClick={emptyCta.onClick}>
            {emptyCta.label}
          </Button>
        )}
      </div>
    );
  }

  /* Success */
  return <>{children(data as T)}</>;
}

export { DataState };
export type { DataStateProps };

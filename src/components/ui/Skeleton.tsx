interface SkeletonProps {
  variant?: 'line' | 'circle' | 'card' | 'rectangle';
  width?: string | number;
  height?: string | number;
  className?: string;
}

const baseStyles = 'animate-pulse bg-neutral-200 rounded-sm';

function Skeleton({ variant = 'line', width, height, className = '' }: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  const variantStyles: Record<NonNullable<SkeletonProps['variant']>, string> = {
    line: 'h-4 w-full rounded-sm',
    circle: 'rounded-full',
    card: 'h-32 w-full rounded-lg',
    rectangle: 'h-20 w-full rounded-md',
  };

  return (
    <div
      className={[baseStyles, variantStyles[variant], className].filter(Boolean).join(' ')}
      style={style}
      aria-hidden="true"
    />
  );
}

/* ── Skeleton Group (common loading patterns) ── */

function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={['flex flex-col gap-2', className].filter(Boolean).join(' ')} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="line"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={['bg-neutral-0 rounded-lg p-4 space-y-3', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      <Skeleton variant="rectangle" height={120} />
      <Skeleton variant="line" width="70%" />
      <Skeleton variant="line" width="40%" />
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonCard };
export type { SkeletonProps };

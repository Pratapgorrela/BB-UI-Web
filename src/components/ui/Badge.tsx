import { type HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-neutral-200 text-neutral-700',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-success-100 text-success-800',
  warning: 'bg-warning-100 text-warning-700',
  danger: 'bg-danger-100 text-danger-700',
  info: 'bg-info-100 text-info-700',
};

function Badge({ variant = 'default', children, className = '', ...props }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-3 py-1 text-caption font-medium',
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </span>
  );
}

/* â”€â”€ Discount Badge (specialized) â”€â”€ */

interface DiscountBadgeProps {
  percentage: number;
  className?: string;
  variant?: BadgeVariant;
}

function DiscountBadge({ percentage, className = '', variant = 'success' }: DiscountBadgeProps) {
  return (
    <Badge variant={variant} className={className}>
      {percentage}% OFF
    </Badge>
  );
}

export { Badge, DiscountBadge };
export type { BadgeProps, BadgeVariant, DiscountBadgeProps };

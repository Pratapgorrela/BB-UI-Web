import { type HTMLAttributes, forwardRef } from 'react';

type CardVariant = 'default' | 'raised' | 'interactive';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-neutral-0 border border-neutral-300',
  raised: 'bg-neutral-0 shadow-md',
  interactive:
    'bg-neutral-0 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-100 transition-all duration-fast ease-fast cursor-pointer',
};

const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          'rounded-lg overflow-hidden',
          variantStyles[variant],
          paddingStyles[padding],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export { Card };
export type { CardProps, CardVariant };

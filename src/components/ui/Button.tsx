import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-500 text-neutral-0 hover:bg-primary-600 active:bg-primary-700',
  secondary:
    'bg-primary-100 text-primary-700 hover:bg-primary-200 active:bg-primary-300',
  outline:
    'border border-primary-500 text-primary-600 bg-transparent hover:bg-primary-100 active:bg-primary-200',
  ghost:
    'text-primary-600 bg-transparent hover:bg-primary-100 active:bg-primary-200',
  danger:
    'bg-danger-500 text-neutral-0 hover:bg-danger-600 active:bg-danger-700',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-body-sm gap-1.5',
  md: 'h-11 px-4 text-body gap-2',
  lg: 'h-12 px-6 text-body-lg gap-2.5',
};

const focusStyles: Record<ButtonVariant, string> = {
  primary: 'focus-visible:shadow-focus focus-visible:outline-none',
  secondary: 'focus-visible:shadow-focus focus-visible:outline-none',
  outline: 'focus-visible:shadow-focus focus-visible:outline-none',
  ghost: 'focus-visible:shadow-focus focus-visible:outline-none',
  danger: 'focus-visible:shadow-focus-error focus-visible:outline-none',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      className = '',
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          'inline-flex items-center justify-center font-semibold rounded-md',
          'transition-colors duration-fast ease-fast',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          focusStyles[variant],
          fullWidth ? 'w-full' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {loading ? (
          <Loader2
            className="animate-spin"
            size={size === 'sm' ? 16 : 20}
            aria-hidden="true"
          />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };

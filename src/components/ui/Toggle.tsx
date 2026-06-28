import { useId } from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
}: ToggleProps) {
  const id = useId();

  return (
    <div
      className={[
        'flex items-center justify-between gap-4',
        disabled ? 'opacity-50' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {(label || description) && (
        <div className="flex flex-col gap-0.5 min-w-0">
          {label && (
            <label htmlFor={id} className="text-body font-medium text-neutral-800 cursor-pointer">
              {label}
            </label>
          )}
          {description && (
            <p className="text-body-sm text-neutral-500">{description}</p>
          )}
        </div>
      )}

      <button
        id={id}
        role="switch"
        type="button"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 border-transparent',
          'transition-colors duration-normal ease-normal',
          'focus-visible:outline-none focus-visible:shadow-focus',
          'disabled:cursor-not-allowed',
          checked ? 'bg-primary-500' : 'bg-neutral-300',
        ].join(' ')}
      >
        <span
          aria-hidden="true"
          className={[
            'inline-block h-5 w-5 rounded-full bg-neutral-0 shadow-sm',
            'transition-transform duration-normal ease-normal',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          ].join(' ')}
        />
      </button>
    </div>
  );
}

export { Toggle };
export type { ToggleProps };

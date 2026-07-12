import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, forwardRef, useId } from 'react';

/* ── Shared Label + Helper ── */

interface FieldWrapperProps {
  label?: string;
  helperText?: string;
  error?: string;
  id: string;
  children: React.ReactNode;
}

function FieldWrapper({ label, helperText, error, id, children }: FieldWrapperProps) {
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-body-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p id={errorId} role="alert" className="text-caption text-danger-600">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-caption text-neutral-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

/* ── Shared Styles ── */

const baseInputStyles = [
  'w-full h-11 px-3 rounded-sm bg-neutral-0 border text-body text-neutral-700',
  'placeholder:text-neutral-400',
  'transition-colors duration-fast ease-fast',
  'disabled:bg-neutral-200 disabled:text-neutral-500 disabled:cursor-not-allowed',
].join(' ');

function getInputBorderStyles(error?: string) {
  if (error) {
    return 'border-danger-500 focus:border-danger-500 focus:shadow-focus-error focus:outline-none';
  }
  return 'border-neutral-300 focus:border-primary-500 focus:shadow-focus focus:outline-none';
}

/* ── TextInput ── */

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, id: propId, className = '', ...props }, ref) => {
    const autoId = useId();
    const id = propId ?? autoId;

    return (
      <FieldWrapper label={label} helperText={helperText} error={error} id={id}>
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            className={[
              baseInputStyles,
              getInputBorderStyles(error),
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              className,
            ].filter(Boolean).join(' ')}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>
      </FieldWrapper>
    );
  },
);

TextInput.displayName = 'TextInput';

/* ── Select ── */

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, options, placeholder, id: propId, className = '', ...props }, ref) => {
    const autoId = useId();
    const id = propId ?? autoId;

    return (
      <FieldWrapper label={label} helperText={helperText} error={error} id={id}>
        <select
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={[
            baseInputStyles,
            getInputBorderStyles(error),
            'appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237F7290%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")] bg-no-repeat bg-[position:right_12px_center] pr-10',
            className,
          ].filter(Boolean).join(' ')}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FieldWrapper>
    );
  },
);

Select.displayName = 'Select';

/* ── Textarea ── */

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, id: propId, className = '', ...props }, ref) => {
    const autoId = useId();
    const id = propId ?? autoId;

    return (
      <FieldWrapper label={label} helperText={helperText} error={error} id={id}>
        <textarea
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={[
            baseInputStyles,
            getInputBorderStyles(error),
            'h-auto min-h-24 py-2.5 resize-y',
            className,
          ].filter(Boolean).join(' ')}
          rows={4}
          {...props}
        />
      </FieldWrapper>
    );
  },
);

Textarea.displayName = 'Textarea';

export { TextInput, Select, Textarea };
export type { TextInputProps, SelectProps, TextareaProps };

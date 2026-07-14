import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  /** Current rating, 0–5 (0 = unrated, only meaningful in input mode). */
  value: number;
  /** Providing a handler switches the component into interactive input mode. */
  onChange?: (value: number) => void;
  /** Star icon size in px. Defaults: 16 display, 28 input. */
  size?: number;
  /** Accessible group label (input mode). */
  label?: string;
  className?: string;
}

const MAX_STARS = 5;

/**
 * Star rating — display mode (read-only `role="img"`) or, when `onChange` is
 * given, an input following the radio-group pattern: arrow keys move and
 * select, each star is a 44px touch target.
 */
function StarRating({ value, onChange, size, label, className = '' }: StarRatingProps) {
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  if (!onChange) {
    const starSize = size ?? 16;
    return (
      <span
        role="img"
        aria-label={`Rated ${value} out of 5`}
        className={`flex gap-0.5 ${className}`}
      >
        {Array.from({ length: MAX_STARS }).map((_, index) => (
          <Star
            key={index}
            size={starSize}
            aria-hidden="true"
            className={index < value ? 'fill-warning-500 text-warning-500' : 'text-neutral-300'}
          />
        ))}
      </span>
    );
  }

  const starSize = size ?? 28;

  const select = (next: number) => {
    const clamped = Math.min(MAX_STARS, Math.max(1, next));
    onChange(clamped);
    buttonsRef.current[clamped - 1]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      select(value + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      select(value - 1);
    }
  };

  return (
    <div role="radiogroup" aria-label={label ?? 'Rating'} className={`flex ${className}`}>
      {Array.from({ length: MAX_STARS }).map((_, index) => {
        const starValue = index + 1;
        const selected = value === starValue;
        return (
          <button
            key={starValue}
            ref={(node) => {
              buttonsRef.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            tabIndex={starValue === Math.max(1, value) ? 0 : -1}
            onClick={() => select(starValue)}
            onKeyDown={handleKeyDown}
            className="flex size-touch-target items-center justify-center rounded-full transition-colors duration-fast hover:bg-neutral-100 focus-visible:shadow-focus focus-visible:outline-none"
          >
            <Star
              size={starSize}
              aria-hidden="true"
              className={
                starValue <= value ? 'fill-warning-500 text-warning-500' : 'text-neutral-300'
              }
            />
          </button>
        );
      })}
    </div>
  );
}

export { StarRating };
export type { StarRatingProps };

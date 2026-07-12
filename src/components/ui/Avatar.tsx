import { useState } from 'react';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-caption',
  md: 'w-10 h-10 text-body-sm',
  lg: 'w-14 h-14 text-body-lg',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function Avatar({ src, alt, name, size = 'md', className = '' }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showFallback = !src || imgError;
  const initials = name ? getInitials(name) : '?';

  return (
    <div
      className={[
        'relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0',
        sizeStyles[size],
        showFallback ? 'bg-primary-100 text-primary-700 font-semibold' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="img"
      aria-label={alt ?? name ?? 'Avatar'}
    >
      {showFallback ? (
        <span aria-hidden="true">{initials}</span>
      ) : (
        <img
          src={src}
          alt={alt ?? name ?? 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}

export { Avatar };
export type { AvatarProps, AvatarSize };

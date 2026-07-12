import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

function Container({ children, className = '' }: ContainerProps) {
  return (
    <div
      className={['mx-auto w-full max-w-(--width-max) px-4 sm:px-6 lg:px-8', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

export { Container };
export type { ContainerProps };

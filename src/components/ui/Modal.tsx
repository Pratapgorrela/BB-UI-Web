import { useEffect, useRef, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  /** Accessible name when no visible title is rendered. */
  ariaLabel?: string;
  /** Set false for edge-to-edge content (e.g. hero images); defaults to the padded body. */
  padded?: boolean;
}

function Modal({
  open,
  onClose,
  title,
  children,
  className = '',
  ariaLabel,
  padded = true,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      // Focus trap: keep Tab cycling inside the dialog (a11y checklist).
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || active === dialogRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleKeydown);
      document.body.style.overflow = 'hidden';
      dialogRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    };
  }, [open, handleKeydown]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-(--z-modal) flex items-end md:items-center md:justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title}
        tabIndex={-1}
        className={[
          'relative z-10 bg-neutral-0 w-full max-h-[85vh] overflow-y-auto',
          'rounded-t-xl md:rounded-xl md:max-w-[480px] md:mx-4',
          'shadow-xl animate-slide-up md:animate-fade-in',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-neutral-300">
            <h2 className="text-h4 font-semibold font-heading text-neutral-800">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-neutral-200 transition-colors duration-fast text-neutral-500"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className={padded ? 'p-4' : ''}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export { Modal };
export type { ModalProps };

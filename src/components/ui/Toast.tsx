import { createContext, useCallback, useContext, useState, useEffect, type ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  addToast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('[Toast] useToast must be used within ToastProvider');
  return ctx;
}

/* ── Toast Provider ── */

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = 5000) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, variant, duration }]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

/* ── Toast Container ── */

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-toast flex flex-col gap-2 w-full max-w-[400px] px-4"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

/* ── Individual Toast ── */

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-success-100 text-success-700 border-success-300',
  error: 'bg-danger-100 text-danger-700 border-danger-300',
  info: 'bg-info-100 text-info-700 border-info-300',
  warning: 'bg-warning-100 text-warning-700 border-warning-300',
};

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle size={20} />,
  error: <AlertCircle size={20} />,
  info: <Info size={20} />,
  warning: <AlertTriangle size={20} />,
};

function ToastCard({
  toast,
  onRemove,
}: {
  toast: ToastItem;
  onRemove: (id: string) => void;
}) {
  useEffect(() => {
    if (!toast.duration) return;
    const timer = setTimeout(() => onRemove(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      role="alert"
      className={[
        'flex items-center gap-3 p-3 rounded-lg border shadow-lg',
        variantStyles[toast.variant],
      ].join(' ')}
    >
      <span className="shrink-0" aria-hidden="true">
        {variantIcons[toast.variant]}
      </span>
      <p className="flex-1 text-body-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 p-1 rounded-full hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export { ToastProvider, useToast };
export type { ToastVariant, ToastItem };

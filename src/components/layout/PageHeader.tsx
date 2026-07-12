import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  backTo?: string;
  onBack?: () => void;
  showBack?: boolean;
  actions?: ReactNode;
}

function PageHeader({ title, backTo, onBack, showBack = true, actions }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center gap-2 py-4">
      {showBack && (
        <button
          type="button"
          aria-label="Go back"
          onClick={handleBack}
          className="flex size-touch-target items-center justify-center rounded-full text-neutral-700 transition-colors duration-fast ease-fast hover:bg-neutral-200 focus-visible:shadow-focus focus-visible:outline-none"
        >
          <ArrowLeft size={24} aria-hidden="true" />
        </button>
      )}
      <h1 className="min-w-0 flex-1 truncate font-heading text-h3 font-bold text-neutral-800">
        {title}
      </h1>
      {actions}
    </div>
  );
}

export { PageHeader };
export type { PageHeaderProps };

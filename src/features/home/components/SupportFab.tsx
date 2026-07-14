import { useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';

/**
 * Floating Support button. Purple per the Figma reference (design.md specs a green FAB —
 * the Figma is the visual source of truth here). Sits above the mobile bottom nav.
 * Navigates to Help & Support (F16).
 */
function SupportFab() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate('/help')}
      className="fixed right-4 bottom-[calc(var(--height-bottom-nav)+1rem+env(safe-area-inset-bottom))] z-(--z-sticky) flex items-center gap-2 rounded-full bg-primary-600 px-4 py-3 text-body-sm font-semibold text-neutral-0 shadow-lg transition-colors duration-fast ease-fast hover:bg-primary-700 focus-visible:shadow-focus focus-visible:outline-none md:bottom-6"
    >
      <Phone size={18} aria-hidden="true" />
      Support
    </button>
  );
}

export { SupportFab };

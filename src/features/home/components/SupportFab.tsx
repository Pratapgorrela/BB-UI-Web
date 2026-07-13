import { Phone } from 'lucide-react';
import { useToast } from '../../../components/ui';

/**
 * Floating Support button. Purple per the Figma reference (design.md specs a green FAB —
 * the Figma is the visual source of truth here). Sits above the mobile bottom nav.
 * Tap fires a "coming soon" toast until F16 Help & Support wires real support actions.
 */
function SupportFab() {
  const { addToast } = useToast();

  return (
    <button
      type="button"
      onClick={() => addToast('Support is coming soon', 'info')}
      className="fixed right-4 bottom-[calc(var(--height-bottom-nav)+1rem+env(safe-area-inset-bottom))] z-(--z-sticky) flex items-center gap-2 rounded-full bg-primary-600 px-4 py-3 text-body-sm font-semibold text-neutral-0 shadow-lg transition-colors duration-fast ease-fast hover:bg-primary-700 focus-visible:shadow-focus focus-visible:outline-none md:bottom-6"
    >
      <Phone size={18} aria-hidden="true" />
      Support
    </button>
  );
}

export { SupportFab };

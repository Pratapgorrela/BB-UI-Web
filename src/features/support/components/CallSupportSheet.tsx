import { Clock, Mail, Phone } from 'lucide-react';
import { Modal } from '../../../components/ui';
import { SUPPORT_CONTACT } from '../utils/supportLabels';

interface CallSupportSheetProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Call Support bottom sheet (Figma 184:7526). Contact details are static
 * client content per the LOCKED contract section.
 */
function CallSupportSheet({ open, onClose }: CallSupportSheetProps) {
  return (
    <Modal open={open} onClose={onClose} title="Call support">
      <div className="flex flex-col gap-4">
        <p className="text-body-sm text-neutral-600">
          Our care team is happy to help with bookings, payments, and anything in between.
        </p>

        <div className="flex items-center gap-3 rounded-lg bg-neutral-100 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <Clock size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-caption text-neutral-500">Support hours</p>
            <p className="text-body-sm font-medium text-neutral-800">{SUPPORT_CONTACT.hours}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-neutral-100 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <Mail size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-caption text-neutral-500">Email</p>
            <a
              href={`mailto:${SUPPORT_CONTACT.email}`}
              className="text-body-sm font-medium text-primary-600 underline-offset-2 hover:underline focus-visible:shadow-focus focus-visible:outline-none"
            >
              {SUPPORT_CONTACT.email}
            </a>
          </div>
        </div>

        <a
          href={SUPPORT_CONTACT.telHref}
          aria-label={`Call support on ${SUPPORT_CONTACT.displayPhone}`}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary-500 px-4 text-body font-semibold text-neutral-0 transition-colors duration-fast hover:bg-primary-600 focus-visible:shadow-focus focus-visible:outline-none"
        >
          <Phone size={18} aria-hidden="true" />
          Call {SUPPORT_CONTACT.displayPhone}
        </a>
      </div>
    </Modal>
  );
}

export { CallSupportSheet };
export type { CallSupportSheetProps };

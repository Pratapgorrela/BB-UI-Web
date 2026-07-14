import { formatDistanceToNow } from 'date-fns';
import { Card } from '../../../components/ui';
import { SupportRequestStatusBadge } from './SupportRequestStatusBadge';
import { SUPPORT_ISSUE_TYPE_LABEL } from '../utils/supportLabels';
import type { SupportRequest } from '../types/support';

interface SupportRequestCardProps {
  request: SupportRequest;
}

/** One row of the Your Support Requests list. Read-only — no actions in MVP. */
function SupportRequestCard({ request }: SupportRequestCardProps) {
  return (
    <Card variant="default" padding="md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-body font-semibold text-neutral-800">
            {SUPPORT_ISSUE_TYPE_LABEL[request.issueType]}
          </p>
          <p className="font-mono text-caption text-neutral-500">{request.referenceCode}</p>
        </div>
        <SupportRequestStatusBadge status={request.status} className="shrink-0" />
      </div>

      <p className="mt-2 line-clamp-2 text-body-sm text-neutral-600">{request.description}</p>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-neutral-200 pt-2.5">
        <p className="text-caption text-neutral-500">
          Raised {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
        </p>
        {request.bookingReferenceCode && (
          <p className="font-mono text-caption text-neutral-500">
            Booking {request.bookingReferenceCode}
          </p>
        )}
      </div>
    </Card>
  );
}

export { SupportRequestCard };
export type { SupportRequestCardProps };

import { Badge } from '../../../components/ui';
import { SUPPORT_STATUS_LABEL, SUPPORT_STATUS_VARIANT } from '../utils/supportLabels';
import type { SupportRequestStatus } from '../types/support';

interface SupportRequestStatusBadgeProps {
  status: SupportRequestStatus;
  className?: string;
}

function SupportRequestStatusBadge({ status, className }: SupportRequestStatusBadgeProps) {
  return (
    <Badge variant={SUPPORT_STATUS_VARIANT[status]} className={className}>
      {SUPPORT_STATUS_LABEL[status]}
    </Badge>
  );
}

export { SupportRequestStatusBadge };
export type { SupportRequestStatusBadgeProps };

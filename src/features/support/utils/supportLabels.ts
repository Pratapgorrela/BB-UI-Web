import type { BadgeVariant } from '../../../components/ui';
import type { SupportIssueType, SupportRequestStatus } from '../types/support';

/** Display labels for the concern categories (sentence case per the voice guide). */
const SUPPORT_ISSUE_TYPE_LABEL: Record<SupportIssueType, string> = {
  BOOKING_ISSUE: 'Booking issue',
  PAYMENT_ISSUE: 'Payment issue',
  SERVICE_QUALITY: 'Service quality',
  APP_ISSUE: 'App issue',
  OTHER: 'Other',
};

/** Select options for the Raise a Concern form, in display order. */
const SUPPORT_ISSUE_TYPE_OPTIONS: { value: SupportIssueType; label: string }[] = (
  ['BOOKING_ISSUE', 'PAYMENT_ISSUE', 'SERVICE_QUALITY', 'APP_ISSUE', 'OTHER'] as const
).map((value) => ({ value, label: SUPPORT_ISSUE_TYPE_LABEL[value] }));

const SUPPORT_STATUS_LABEL: Record<SupportRequestStatus, string> = {
  OPEN: 'Open',
  IN_REVIEW: 'In review',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

const SUPPORT_STATUS_VARIANT: Record<SupportRequestStatus, BadgeVariant> = {
  OPEN: 'warning',
  IN_REVIEW: 'info',
  RESOLVED: 'success',
  CLOSED: 'default',
};

/**
 * Call Support card content — static client content per the LOCKED contract
 * section ("deliberately not an endpoint"). If contact details ever become
 * dynamic, add the endpoint to contract.md first.
 */
const SUPPORT_CONTACT = {
  displayPhone: '+91 80 4747 1234',
  telHref: 'tel:+918047471234',
  hours: 'Every day, 8:00 AM – 8:00 PM IST',
  email: 'care@beautybus.in',
} as const;

export {
  SUPPORT_CONTACT,
  SUPPORT_ISSUE_TYPE_LABEL,
  SUPPORT_ISSUE_TYPE_OPTIONS,
  SUPPORT_STATUS_LABEL,
  SUPPORT_STATUS_VARIANT,
};

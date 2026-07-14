export type {
  CreateSupportRequestRequest,
  Faq,
  SupportIssueType,
  SupportRequest,
  SupportRequestListFilters,
  SupportRequestsPage,
  SupportRequestStatus,
} from './types/support';

export {
  createSupportRequestRequestSchema,
  faqSchema,
  NO_BOOKING_VALUE,
  raiseConcernFormSchema,
  supportIssueTypeSchema,
  supportRequestSchema,
  supportRequestStatusSchema,
} from './types/support.schema';

export { createSupportRequest, fetchFaqs, fetchSupportRequests } from './api/supportApi';

export {
  FAQS_STALE_TIME_MS,
  SUPPORT_REQUESTS_STALE_TIME_MS,
  supportKeys,
} from './hooks/keys';
export { useFetchFaqs } from './hooks/useFetchFaqs';
export { useFetchSupportRequests } from './hooks/useFetchSupportRequests';
export { useCreateSupportRequest } from './hooks/useCreateSupportRequest';

export {
  SUPPORT_CONTACT,
  SUPPORT_ISSUE_TYPE_LABEL,
  SUPPORT_ISSUE_TYPE_OPTIONS,
  SUPPORT_STATUS_LABEL,
  SUPPORT_STATUS_VARIANT,
} from './utils/supportLabels';

export { CallSupportSheet } from './components/CallSupportSheet';
export { SupportRequestCard } from './components/SupportRequestCard';
export { SupportRequestStatusBadge } from './components/SupportRequestStatusBadge';

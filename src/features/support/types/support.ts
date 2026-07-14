/**
 * FAQ + SupportRequest entities for F16 (Help & Support).
 * Mirrors the LOCKED "Help & Support" contract entities field-for-field.
 */

/** Editorial FAQ item shown on the Help & Support screen. Guest-readable. */
interface Faq {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

/** The 5 concern categories from the contract. */
type SupportIssueType =
  | 'BOOKING_ISSUE'
  | 'PAYMENT_ISSUE'
  | 'SERVICE_QUALITY'
  | 'APP_ISSUE'
  | 'OTHER';

/** Server-owned lifecycle — the client creates and reads, never updates. */
type SupportRequestStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED';

interface SupportRequest {
  id: string;
  userId: string;
  referenceCode: string;
  bookingId: string | null;
  bookingReferenceCode: string | null;
  issueType: SupportIssueType;
  description: string;
  status: SupportRequestStatus;
  createdAt: string;
  updatedAt: string;
}

/** POST /support-requests body. */
interface CreateSupportRequestRequest {
  bookingId?: string | null;
  issueType: SupportIssueType;
  description: string;
}

/** GET /support-requests query filters. */
interface SupportRequestListFilters {
  page?: number;
  limit?: number;
}

/** A page of support requests from `GET /support-requests` (paginated envelope). */
interface SupportRequestsPage {
  requests: SupportRequest[];
  pagination: import('../../../types/api').Pagination;
}

export type {
  CreateSupportRequestRequest,
  Faq,
  SupportIssueType,
  SupportRequest,
  SupportRequestListFilters,
  SupportRequestsPage,
  SupportRequestStatus,
};

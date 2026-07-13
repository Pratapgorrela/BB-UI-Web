/**
 * Notification + NotificationSettings entities for F11 (Alerts & Notification Settings).
 * Mirrors the LOCKED `Notification` / `NotificationSettings` contract entities
 * field-for-field.
 */

/** The 5 notification kinds from the contract. */
type NotificationType =
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_REMINDER'
  | 'BOOKING_CANCELLED'
  | 'REVIEW_REQUEST'
  | 'PROMO';

/** Tab category — DERIVED from `type` (not a stored field). */
type NotificationCategory = 'BOOKING' | 'OFFER';

interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  referenceId: string | null;
  referenceType: string | null;
  createdAt: string;
}

/** Per-user notification preferences singleton. */
interface NotificationSettings {
  userId: string;
  whatsappEnabled: boolean;
  bookingUpdates: boolean;
  servicePromotions: boolean;
  referralRewards: boolean;
  feedbackRequests: boolean;
  updatedAt: string;
}

/** PATCH /notification-settings — any subset of the toggle fields. */
type UpdateNotificationSettingsRequest = Partial<
  Pick<
    NotificationSettings,
    'whatsappEnabled' | 'bookingUpdates' | 'servicePromotions' | 'referralRewards' | 'feedbackRequests'
  >
>;

/** GET /notifications query filters. */
interface NotificationListFilters {
  category?: NotificationCategory;
  page?: number;
  limit?: number;
}

/** A page of notifications from `GET /notifications` (paginated envelope). */
interface NotificationsPage {
  notifications: Notification[];
  pagination: import('../../../types/api').Pagination;
}

/** GET /notifications/unread-count response payload. */
interface UnreadCount {
  count: number;
}

/** PATCH /notifications/mark-all-read response payload. */
interface MarkAllReadResult {
  updated: number;
}

export type {
  MarkAllReadResult,
  Notification,
  NotificationCategory,
  NotificationListFilters,
  NotificationSettings,
  NotificationsPage,
  NotificationType,
  UnreadCount,
  UpdateNotificationSettingsRequest,
};

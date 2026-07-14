import type { Faq } from '../../features/support/types/support';

/** UUID-v4-shaped stable FAQ id from an index. */
function faqId(n: number): string {
  return `bbfa0000-0000-4000-8000-${String(n).padStart(12, '0')}`;
}

/**
 * Read-only editorial FAQ seed for the Help & Support screen (guest-readable,
 * never mutated). Ordered by `sortOrder` — the handler sorts defensively anyway.
 */
const seedFaqs: Faq[] = [
  {
    id: faqId(1),
    question: 'How does Beauty Bus work?',
    answer:
      'Beauty Bus brings the salon to your doorstep. Browse services, add them to your cart, pick a time slot and address at checkout, and our van arrives with a professional stylist and everything needed for your service.',
    sortOrder: 1,
  },
  {
    id: faqId(2),
    question: 'How do I book a service?',
    answer:
      'Add one or more services to your cart, then continue to checkout. Choose a saved address, pick an arrival window that suits you, and place the booking. You will get a confirmation with a reference code right away.',
    sortOrder: 2,
  },
  {
    id: faqId(3),
    question: 'Can I reschedule or cancel a booking?',
    answer:
      'Yes. Open the booking under My bookings and choose Reschedule or Cancel. Both are free up to 2 hours before your slot. Inside the 2-hour window the booking is locked and our team begins preparing for your visit.',
    sortOrder: 3,
  },
  {
    id: faqId(4),
    question: 'How do I track the van on the day of my appointment?',
    answer:
      'Once your booking is confirmed, open it under My bookings and tap Track van. You will see the live status, the arrival estimate, and a Call button for the driver.',
    sortOrder: 4,
  },
  {
    id: faqId(5),
    question: 'What payment methods do you accept?',
    answer:
      'You can pay by UPI, credit or debit card, or cash after the service. Applied coupons and taxes are always shown in the payment summary before you place the booking.',
    sortOrder: 5,
  },
  {
    id: faqId(6),
    question: 'Are your specialists verified?',
    answer:
      'Every specialist is background-verified, trained, and certified for the services they perform. Your booking confirmation shows the specialist assigned to your appointment.',
    sortOrder: 6,
  },
  {
    id: faqId(7),
    question: 'What hygiene measures do you follow?',
    answer:
      'All tools are sterilised between appointments, single-use items are never reused, and the van is cleaned after every visit. Specialists follow a strict hygiene checklist for every service.',
    sortOrder: 7,
  },
  {
    id: faqId(8),
    question: 'How do refunds work?',
    answer:
      'If you cancel outside the 2-hour window, any prepaid amount is refunded to the original payment method within 5-7 business days. For issues with a completed service, raise a concern and our team will review it within 24 hours.',
    sortOrder: 8,
  },
];

export { seedFaqs };

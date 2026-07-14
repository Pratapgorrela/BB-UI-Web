/**
 * Policy documents — static client content by contract convention (mirrors
 * SUPPORT_CONTACT in features/support): legal copy is editorial, versioned
 * with the app, and deliberately not an endpoint. If policies ever become
 * dynamic (CMS-driven), add the endpoint to contract.md first.
 */

export type PolicySlug = 'terms' | 'privacy' | 'cancellation-refund' | 'safety-hygiene';

export interface PolicySection {
  heading: string;
  paragraphs: string[];
}

export interface Policy {
  slug: PolicySlug;
  title: string;
  summary: string;
  /** ISO date of the last editorial revision, shown as "Last updated". */
  updatedAt: string;
  sections: PolicySection[];
}

export const POLICIES: Policy[] = [
  {
    slug: 'terms',
    title: 'Terms of service',
    summary: 'The agreement that applies when you use Beauty Bus',
    updatedAt: '2026-07-01',
    sections: [
      {
        heading: 'About our service',
        paragraphs: [
          'Beauty Bus brings professional salon services to your doorstep. When you place a booking, a fully equipped Beauty Bus van and an assigned specialist arrive at your chosen address during the arrival window you select.',
          'By creating an account or placing a booking you agree to these terms. If you do not agree, please do not use the service.',
        ],
      },
      {
        heading: 'Your account',
        paragraphs: [
          'You must provide accurate contact details so our team can reach you about your bookings. You are responsible for keeping your login credentials confidential and for all activity under your account.',
          'You must be 18 or older to hold an account. Services for minors can be booked by a parent or guardian who is present during the appointment.',
        ],
      },
      {
        heading: 'Bookings and pricing',
        paragraphs: [
          'All prices are shown in Indian rupees (₹) and include applicable taxes as itemised in the payment summary at checkout. Combo prices and discounts are honoured as displayed at the time you place the booking.',
          'A booking is confirmed once you receive a booking reference. Arrival windows are estimates — traffic and prior appointments can shift arrival within the selected window.',
        ],
      },
      {
        heading: 'Acceptable use',
        paragraphs: [
          'Please provide a safe, reasonable working space for the specialist and treat our staff with respect. We may decline or end an appointment where staff safety is at risk, and refuse future service for repeated misuse.',
        ],
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy policy',
    summary: 'What we collect, why, and the choices you have',
    updatedAt: '2026-07-01',
    sections: [
      {
        heading: 'What we collect',
        paragraphs: [
          'We collect the details you give us — name, email, phone number and saved addresses — plus your booking history and any support requests or reviews you submit.',
          'We do not sell your personal data to anyone.',
        ],
      },
      {
        heading: 'How we use it',
        paragraphs: [
          'Your data is used to deliver appointments (routing the van to your address, assigning a specialist), to notify you about booking updates, and — only if you opt in — to send offers and promotions.',
          'You control notification categories from Notification settings, including WhatsApp updates.',
        ],
      },
      {
        heading: 'Storage and security',
        paragraphs: [
          'Your data is stored on secured servers located in India and is encrypted in transit. Access is limited to staff who need it to operate the service.',
        ],
      },
      {
        heading: 'Your choices',
        paragraphs: [
          'You can edit your profile and addresses in the app at any time. To request a copy of your data or delete your account, contact our support team — we respond within 7 working days.',
        ],
      },
    ],
  },
  {
    slug: 'cancellation-refund',
    title: 'Cancellation & refund policy',
    summary: 'How cancelling, rescheduling and refunds work',
    updatedAt: '2026-07-01',
    sections: [
      {
        heading: 'Cancelling a booking',
        paragraphs: [
          'You can cancel any pending or confirmed booking free of charge up to 2 hours before your scheduled arrival window, straight from the booking details page.',
          'Within 2 hours of the arrival window the booking is locked — the van and specialist are already committed to your appointment. If you need help inside that window, call support and we will do our best.',
        ],
      },
      {
        heading: 'Rescheduling',
        paragraphs: [
          'Rescheduling follows the same rule: pick a new slot any time up to 2 hours before the current arrival window, at no cost. Your services, address and pricing stay unchanged.',
        ],
      },
      {
        heading: 'Refunds',
        paragraphs: [
          'For prepaid bookings cancelled on time, the full amount is returned to your original payment method within 5–7 working days.',
          'If we cancel on you — van breakdown, specialist unavailability or weather — you receive a full refund plus a priority slot for rebooking.',
        ],
      },
      {
        heading: 'No-shows',
        paragraphs: [
          'If our team arrives and cannot reach you within 15 minutes at the booked address, the appointment is marked as a no-show and the booking amount is not refundable.',
        ],
      },
    ],
  },
  {
    slug: 'safety-hygiene',
    title: 'Safety & hygiene policy',
    summary: 'The standards every Beauty Bus appointment follows',
    updatedAt: '2026-07-01',
    sections: [
      {
        heading: 'Sanitised equipment',
        paragraphs: [
          'Every tool is sterilised between appointments using hospital-grade disinfectant, and single-use items — razors, wax strips, applicators — are opened fresh in front of you and discarded after use.',
        ],
      },
      {
        heading: 'Trained professionals',
        paragraphs: [
          'All specialists are certified, background-verified and trained in our hygiene protocol. They carry ID — feel free to ask for it before the appointment begins.',
        ],
      },
      {
        heading: 'Products',
        paragraphs: [
          'We use branded, sealed products within their expiry dates. If you have allergies or sensitive skin, mention it in the booking notes and the specialist will patch-test before full application.',
        ],
      },
      {
        heading: 'Your safety matters',
        paragraphs: [
          'Vans are GPS-tracked throughout your appointment and our support line is open every day. If anything feels off during a visit, contact support immediately — every report is investigated.',
        ],
      },
    ],
  },
];

/** Look up a policy by its URL slug. */
export function findPolicy(slug: string | undefined): Policy | null {
  return POLICIES.find((policy) => policy.slug === slug) ?? null;
}

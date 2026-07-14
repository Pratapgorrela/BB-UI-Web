import { Link } from 'react-router-dom';
import {
  ChevronRight,
  FileText,
  Mail,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '../components/ui';
import { PageHeader } from '../components/layout';
import { POLICIES, type PolicySlug } from '../features/policies';
import { SUPPORT_CONTACT } from '../features/support';

const POLICY_ICONS: Record<PolicySlug, LucideIcon> = {
  terms: FileText,
  privacy: ShieldCheck,
  'cancellation-refund': RotateCcw,
  'safety-hygiene': Sparkles,
};

const rowClass =
  'flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-fast hover:bg-neutral-100 focus-visible:shadow-focus focus-visible:outline-none';

export function Component() {
  return (
    <div className="pb-6">
      <PageHeader title="Terms & policies" backTo="/profile" />

      <div className="flex max-w-xl flex-col gap-6">
        {/* Policy documents (Figma 184:7615) */}
        <section aria-labelledby="policies-heading">
          <h2 id="policies-heading" className="font-heading text-h4 font-semibold text-neutral-800">
            Our policies
          </h2>
          <Card variant="default" padding="none" className="mt-3">
            <ul className="divide-y divide-neutral-200">
              {POLICIES.map((policy) => {
                const Icon = POLICY_ICONS[policy.slug];
                return (
                  <li key={policy.slug}>
                    <Link to={`/policies/${policy.slug}`} className={rowClass}>
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-body font-medium text-neutral-800">
                          {policy.title}
                        </span>
                        <span className="block truncate text-caption text-neutral-500">
                          {policy.summary}
                        </span>
                      </span>
                      <ChevronRight size={18} className="text-neutral-400" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>
        </section>

        {/* Support email contact card */}
        <section aria-labelledby="policy-contact-heading">
          <h2
            id="policy-contact-heading"
            className="font-heading text-h4 font-semibold text-neutral-800"
          >
            Questions about a policy?
          </h2>
          <Card variant="default" padding="none" className="mt-3">
            <a href={`mailto:${SUPPORT_CONTACT.email}`} className={rowClass}>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <Mail size={18} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-body font-medium text-neutral-800">Email support</span>
                <span className="block truncate text-caption text-neutral-500">
                  {SUPPORT_CONTACT.email}
                </span>
              </span>
              <ChevronRight size={18} className="text-neutral-400" aria-hidden="true" />
            </a>
          </Card>
        </section>
      </div>
    </div>
  );
}

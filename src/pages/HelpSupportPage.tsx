import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, HelpCircle, ListChecks, MessageSquareWarning, Phone } from 'lucide-react';
import { Accordion, Card, DataState, Skeleton } from '../components/ui';
import { PageHeader } from '../components/layout';
import { CallSupportSheet, SUPPORT_CONTACT, useFetchFaqs } from '../features/support';
import type { Faq } from '../features/support';

/** Skeleton mirroring the FAQ accordion rows. */
function FaqSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} variant="line" className="h-6 w-full" />
      ))}
    </div>
  );
}

export function Component() {
  const faqs = useFetchFaqs();
  const [calling, setCalling] = useState(false);

  const actionRowClass =
    'flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-fast hover:bg-neutral-100 focus-visible:shadow-focus focus-visible:outline-none';

  return (
    <div className="pb-6">
      <PageHeader title="Help & support" backTo="/profile" />

      <div className="flex max-w-xl flex-col gap-6">
        {/* FAQ accordion (Figma 184:7440) */}
        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="font-heading text-h4 font-semibold text-neutral-800">
            Frequently asked questions
          </h2>
          <Card variant="default" padding="md" className="mt-3">
            <DataState<Faq[]>
              data={faqs.data}
              isLoading={faqs.isLoading}
              error={faqs.error}
              skeleton={<FaqSkeleton />}
              emptyIcon={<HelpCircle size={48} className="text-neutral-400" aria-hidden="true" />}
              emptyMessage="No FAQs yet. Reach us through the options below — we're happy to help."
              onRetry={() => void faqs.refetch()}
            >
              {(items) => (
                <Accordion
                  items={items.map((faq) => ({
                    id: faq.id,
                    title: faq.question,
                    content: faq.answer,
                  }))}
                />
              )}
            </DataState>
          </Card>
        </section>

        {/* Call support card with hours */}
        <section aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="font-heading text-h4 font-semibold text-neutral-800">
            Still need help?
          </h2>
          <Card variant="default" padding="none" className="mt-3">
            <ul className="divide-y divide-neutral-200">
              <li>
                <button type="button" className={actionRowClass} onClick={() => setCalling(true)}>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <Phone size={18} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-body font-medium text-neutral-800">
                      Call support
                    </span>
                    <span className="block truncate text-caption text-neutral-500">
                      {SUPPORT_CONTACT.hours}
                    </span>
                  </span>
                  <ChevronRight size={18} className="text-neutral-400" aria-hidden="true" />
                </button>
              </li>
              <li>
                <Link to="/help/concern" className={actionRowClass}>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <MessageSquareWarning size={18} aria-hidden="true" />
                  </span>
                  <span className="flex-1 text-body font-medium text-neutral-800">
                    Raise a concern
                  </span>
                  <ChevronRight size={18} className="text-neutral-400" aria-hidden="true" />
                </Link>
              </li>
              <li>
                <Link to="/help/requests" className={actionRowClass}>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <ListChecks size={18} aria-hidden="true" />
                  </span>
                  <span className="flex-1 text-body font-medium text-neutral-800">
                    Your support requests
                  </span>
                  <ChevronRight size={18} className="text-neutral-400" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </Card>
        </section>
      </div>

      <CallSupportSheet open={calling} onClose={() => setCalling(false)} />
    </div>
  );
}

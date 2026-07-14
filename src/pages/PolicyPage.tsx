import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { FileQuestion } from 'lucide-react';
import { Card, DataState } from '../components/ui';
import { PageHeader } from '../components/layout';
import { findPolicy, type Policy } from '../features/policies';

export function Component() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const policy = findPolicy(slug);

  return (
    <div className="pb-6">
      <PageHeader title={policy?.title ?? 'Policy not found'} backTo="/policies" />

      <div className="max-w-xl">
        <DataState<Policy>
          data={policy}
          isLoading={false}
          error={null}
          emptyIcon={<FileQuestion size={48} className="text-neutral-400" aria-hidden="true" />}
          emptyMessage="We couldn't find that policy. It may have moved."
          emptyCta={{ label: 'Back to policies', onClick: () => navigate('/policies') }}
        >
          {(doc) => (
            <Card variant="default" padding="lg">
              <p className="text-caption text-neutral-500">
                Last updated {format(new Date(doc.updatedAt), 'd MMMM yyyy')}
              </p>
              <div className="mt-4 flex flex-col gap-6">
                {doc.sections.map((section) => (
                  <section key={section.heading} aria-label={section.heading}>
                    <h2 className="font-heading text-h4 font-semibold text-neutral-800">
                      {section.heading}
                    </h2>
                    <div className="mt-2 flex flex-col gap-3">
                      {section.paragraphs.map((paragraph, index) => (
                        <p key={index} className="text-body-sm leading-relaxed text-neutral-600">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </Card>
          )}
        </DataState>
      </div>
    </div>
  );
}

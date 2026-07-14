import { useNavigate, useSearchParams } from 'react-router-dom';
import { MessageSquareText, Plus } from 'lucide-react';
import { Button, DataState } from '../components/ui';
import { PageHeader } from '../components/layout';
import { SupportRequestCard, useFetchSupportRequests } from '../features/support';
import type { SupportRequestsPage } from '../features/support';

const PAGE_SIZE = 10;

export function Component() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = Number(searchParams.get('page'));
  const page = Number.isInteger(pageParam) && pageParam > 1 ? pageParam : 1;

  const query = useFetchSupportRequests({ page, limit: PAGE_SIZE });

  function selectPage(nextPage: number) {
    setSearchParams(nextPage > 1 ? { page: String(nextPage) } : {}, { replace: true });
  }

  return (
    <div className="pb-6">
      <PageHeader
        title="Your support requests"
        backTo="/help"
        actions={
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Plus size={16} aria-hidden="true" />}
            onClick={() => navigate('/help/concern')}
          >
            New
          </Button>
        }
      />

      <div className="max-w-xl">
        <DataState<SupportRequestsPage>
          data={query.data}
          isLoading={query.isLoading}
          error={query.error}
          isEmpty={(data) => data.requests.length === 0}
          emptyIcon={
            <MessageSquareText size={48} className="text-neutral-400" aria-hidden="true" />
          }
          emptyMessage="No support requests yet. If something isn't right, raise a concern and we'll look into it."
          emptyCta={{ label: 'Raise a concern', onClick: () => navigate('/help/concern') }}
          onRetry={() => void query.refetch()}
        >
          {({ requests, pagination }) => (
            <>
              <div className="flex flex-col gap-3">
                {requests.map((request) => (
                  <SupportRequestCard key={request.id} request={request} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={!pagination.hasPreviousPage || query.isFetching}
                    onClick={() => selectPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-body-sm text-neutral-600">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={!pagination.hasNextPage || query.isFetching}
                    onClick={() => selectPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </DataState>
      </div>
    </div>
  );
}

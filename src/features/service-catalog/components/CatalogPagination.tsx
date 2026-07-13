import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui';
import type { Pagination } from '../../../types/api';

interface CatalogPaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

function CatalogPagination({ pagination, onPageChange }: CatalogPaginationProps) {
  if (pagination.totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-4 pt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={!pagination.hasPreviousPage}
        onClick={() => onPageChange(pagination.page - 1)}
      >
        <ChevronLeft size={16} aria-hidden="true" />
        Prev
      </Button>
      <span className="text-body-sm text-neutral-600">
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={!pagination.hasNextPage}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        Next
        <ChevronRight size={16} aria-hidden="true" />
      </Button>
    </nav>
  );
}

export { CatalogPagination };
export type { CatalogPaginationProps };

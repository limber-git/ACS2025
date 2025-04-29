import Button from "../ui/button/Button";
import { useEffect } from "react";

interface TablePaginationProps {
  page: number;
  total: number | null;
  limit: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  pageSizeOptions?: number[];
}

const defaultPageSizeOptions = [5, 10, 20, 50];

export default function TablePagination({
  page,
  total,
  limit,
  loading,
  onPageChange,
  onLimitChange,
  pageSizeOptions = defaultPageSizeOptions,
}: TablePaginationProps) {
  const totalPages = total !== null ? Math.ceil(total / limit) : 0;
  const isFirstPage = page === 1;
  const isLastPage = total !== null && page >= totalPages;

  useEffect(() => {
    if (total !== null && page > totalPages && totalPages > 0) {
      onPageChange(totalPages);
    }
  }, [page, totalPages, onPageChange]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center px-4 py-4 text-gray-800 dark:text-gray-100 text-sm">
      <div className="text-center sm:text-left">
        {total !== null ? (
          <>
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </>
        ) : (
          <span>Loading...</span>
        )}
      </div>
      <div className="flex justify-center gap-3">
        <Button
          size="sm"
          variant="primary"
          onClick={() => onPageChange(page - 1)}
          disabled={isFirstPage || loading}
          className="transition-opacity disabled:opacity-50"
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="primary"
          onClick={() => onPageChange(page + 1)}
          disabled={isLastPage || loading}
          className="transition-opacity disabled:opacity-50"
        >
          Next
        </Button>
      </div>
      <div className="flex justify-center sm:justify-end items-center gap-2">
        <label htmlFor="pageSize" className="text-nowrap">Items:</label>
        <select
          id="pageSize"
          className="border rounded-md px-2 py-1 bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 text-sm"
          value={limit}
          onChange={(e) => {
            onPageChange(1);
            onLimitChange(Number(e.target.value));
          }}
          disabled={loading}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

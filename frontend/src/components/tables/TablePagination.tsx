import Button from "../ui/button/Button";

interface TablePaginationProps {
  page: number;
  total: number | null;
  limit: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export default function TablePagination({
  page,
  total,
  limit,
  loading,
  onPageChange,
  onLimitChange,
}: TablePaginationProps) {
  return (
    <div className="flex justify-between items-center px-5 py-4 text-gray-800 text-theme-sm dark:text-gray-100 sm:justify-around">
      <div>
        <span className="hidden sm:inline">Page</span> {page}
        {total ? (
          <>
            <span className="hidden sm:inline"> of </span>
            <span className="sm:hidden">-</span>
            {Math.ceil(total / limit)}
          </>
        ) : ''}
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="primary"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1 || loading}
        >
          Prev
        </Button>
        <Button
          size="sm"
          variant="primary"
          onClick={() => onPageChange(total ? (page < Math.ceil(total / limit) ? page + 1 : page) : page + 1)}
          disabled={!!total && page >= Math.ceil(total / limit) || loading}
        >
          Next
        </Button>
      </div>
      <div>
        <label>
          <span className="hidden sm:inline">Pages:</span>
          <select
            className="ml-2 border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            value={limit}
            onChange={e => { onPageChange(1); onLimitChange(Number(e.target.value)); }}
            disabled={loading}
          >
            {[5, 10, 20, 50].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
} 
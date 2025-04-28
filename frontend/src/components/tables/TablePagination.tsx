import Button from "../ui/button/Button";
import { useState, useEffect } from "react";

interface TablePaginationProps {
  page: number;
  total: number | null;
  limit: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  pageSizeOptions?: number[]; // Prop para personalizar las opciones de tamaño de página
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

  console.log("total", total);
  // Efecto para evitar que la página sea mayor que el total de páginas
  useEffect(() => {
    if (total !== null && page > totalPages && totalPages > 0) {
      onPageChange(totalPages);
    }
  }, [page, totalPages, onPageChange]);

  return (
    <div className="flex justify-between items-center px-5 py-4 text-gray-800 text-theme-sm dark:text-gray-100 sm:justify-around">
      <div>
        <span>Page </span> {page} <span>of </span> <span>{total}</span>
        {/* {total !== null ? (
          <>
            <span className="sm:hidden">-</span>
            {totalPages}
          </>
        ) : (
          <span>(Loading...)</span>
        )} */}
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="primary"
          onClick={() => onPageChange(page - 1)}
          disabled={isFirstPage || loading}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="primary"
          onClick={() => onPageChange(page + 1)}
          disabled={isLastPage || loading}
        >
          Next
        </Button>
      </div>
      <div>
        <label className="flex items-center gap-2">
          <span>Items per page:</span>
          <select
            className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 text-theme-xs"
            value={limit}
            onChange={(e) => {
              onPageChange(1); // Reset to the first page when limit changes
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
        </label>
      </div>
    </div>
  );
}
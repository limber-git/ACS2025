import Button from "../../ui/button/Button";
import { useEffect, useState } from "react";
import { api } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import TableSkeleton from "./TableSkeleton";
import DateRangeFilter from "../DateRangeFilter";
import TablePagination from "../TablePagination";


export interface AttendanceRecord {
  recordId: string;
  name: string;
  date: string;
  timeTable: string;
  onDuty: string;
  offDuty: string;
  clockIn: string;
  clockOut: string;
}

function extractHour(timeTable: string) {
  const parts = timeTable.split(' ');
  return parts.length > 1 ? parts[1] : timeTable;
}

function formatDateEnglish(dateStr: string) {
  const dateObj = new Date(dateStr);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function AttendanceTable() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState<number | null>(null);
  const [cache, setCache] = useState<Record<string, { records: AttendanceRecord[]; total: number | null }>>({});
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState<{ startDate: string; endDate: string } | null>(null);
  const [pagination, setPagination] = useState<{ totalItems: number; totalPages: number } | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      const userId = user?.userId;
      if (!userId) {
        setError("No se encontró el usuario logueado.");
        setLoading(false);
        return;
      }
      const cacheKey = `${page}-${limit}-${dateFilter?.startDate ?? "none"}-${dateFilter?.endDate ?? "none"}`;
      // Si la página está en cache, úsala y no hagas la petición
      if (cache[cacheKey]) {
        setRecords(cache[cacheKey].records);
        setTotal(cache[cacheKey].total);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.getAttendanceByUser(userId.toString(), page, limit, dateFilter?.startDate, dateFilter?.endDate);
        // console.log("response", response);
        let newRecords: AttendanceRecord[] = [];
        let newTotal: number | null = null;
        if (Array.isArray(response)) {
          newRecords = response;
          newTotal = null;
        } else {
          newRecords = response.records || [];
          newTotal = response.pagination?.totalItems ?? null;
        }
        setRecords(newRecords);
        setTotal(newTotal);
        setCache(prev => ({ ...prev, [cacheKey]: { records: newRecords, total: newTotal } }));
      } catch (error: any) {
        setError(error.message || "Error al cargar los registros de asistencia.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, page, limit, dateFilter]);

  // Si cambias el usuario (logout/login), limpia el cache
  useEffect(() => {
    setCache({});
    setPage(1);
  }, [user]);

  const handleDateFilterChange = (startDate: string, endDate: string) => {
    setDateFilter({ startDate, endDate });
    setPage(1);
  };

  const handleDateFilterReset = () => {
    setDateFilter(null);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <DateRangeFilter
          onFilterChange={handleDateFilterChange}
          onReset={handleDateFilterReset}
        />
        <TableSkeleton />
        <TablePagination
          page={page}
          total={pagination?.totalItems ?? null}
          limit={limit}
          loading={loading}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <DateRangeFilter
        onFilterChange={handleDateFilterChange}
        onReset={handleDateFilterReset}
      />
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Encabezado */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Date
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Schedule
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Clock In
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Clock Out
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Cuerpo */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="px-5 py-3 text-center text-gray-500">
                  {dateFilter
                    ? "No attendance records found for the selected date range."
                    : "There are no attendance records."}
                </TableCell>
              </TableRow>
            ) : records.map((record) => (
              <TableRow key={record.recordId}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {formatDateEnglish(record.date)}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {extractHour(record.timeTable)}
                </TableCell>
                <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-gray-100">
                  {record.clockIn}
                </TableCell>
                <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-gray-100">
                  {record.clockOut}
                </TableCell>
                <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-gray-400">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-theme-xs dark:text-theme-dark-xs"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Controles de paginación */}
      {records.length > 0 && (
        <TablePagination
          page={page}
          total={pagination?.totalItems ?? null}
          limit={limit}
          loading={loading}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      )}
    </div>
  );
}

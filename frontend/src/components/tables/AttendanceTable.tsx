import Button from "../ui/button/Button";
import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

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

  useEffect(() => {
    const fetchRecords = async () => {
      const userId = user?.userId;
      if (!userId) {
        setError("No se encontró el usuario logueado.");
        setLoading(false);
        return;
      }
      const cacheKey = `${page}-${limit}`;
      // Si la página está en cache, úsala y no hagas la petición
      if (cache[cacheKey]) {
        setRecords(cache[cacheKey].records);
        setTotal(cache[cacheKey].total);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.getAttendanceByUser(userId.toString(), page, limit);
        console.log("response", response);
        let newRecords: AttendanceRecord[] = [];
        let newTotal: number | null = null;
        if (Array.isArray(response)) {
          newRecords = response;
          newTotal = null;
        } else {
          newRecords = response.records || [];
          newTotal = response.total ?? null;
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
  }, [user, page, limit]);

  // Si cambias el usuario (logout/login), limpia el cache
  useEffect(() => {
    setCache({});
    setPage(1);
  }, [user]);

  if (loading) {
    return <div className="p-4 text-center">Cargando registros de asistencia...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                <TableCell colSpan={5} className="px-5 py-3 text-center text-gray-500">
                  No hay registros de asistencia.
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
      <div className="flex justify-between items-center px-5 py-4 text-gray-800 text-theme-sm dark:text-gray-100">
        <div>
          Page {page} {total ? `of ${Math.ceil(total / limit)}` : ''}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => (total ? (p < Math.ceil(total / limit) ? p + 1 : p) : p + 1))}
            disabled={!!total && page >= Math.ceil(total / limit) || loading}
          >
            Next
          </Button>
        </div>
        <div>
          <label>
            Pages:
            <select
              className="ml-2 border rounded px-2 py-1"
              value={limit}
              onChange={e => { setPage(1); setLimit(Number(e.target.value)); }}
              disabled={loading}
            >
              {[5, 10, 20, 50].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

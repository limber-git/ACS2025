import Button from "../ui/button/Button";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import TableSkeleton from "./TableSkeleton";

export interface Application {
  applicationId: string;
  type: string;
  status: string;
  submissionDate: string;
  reason: string;
  reviewDate: string | null;
  regularTime: string;
  time: string;
  state: string;
  by: string | null;
  suggestion: string | null;
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

export default function ApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState<number | null>(null);
  const [pagination, setPagination] = useState<{
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      // console.log('Fetching applications...');
      const userId = user?.userId;
      // console.log('User ID:', userId);
      if (!userId) {
        setError("No se encontró el usuario logueado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // console.log('Fetching applications:', { userId, page, pageSize });
        const response = await api.getApplicationsByUser(userId.toString(), page, pageSize);
        // console.log('API Response:', response);

        setApplications(response.records);
        setPagination(response.pagination);
      } catch (error: any) {
        setError(error.message || "Error al cargar las solicitudes.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user, page, pageSize]);



  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >Date</TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >Type</TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >Status</TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >Regular Time</TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >Time</TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >Revisado por</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {applications.map((application) => (
              <TableRow key={application.applicationId}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {formatDateEnglish(application.submissionDate)}</TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {application.type}</TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium
                    ${application.status === 'Approved' ? 'bg-success/10 text-success' :
                      application.status === 'Pending' ? 'bg-danger/10 text-danger' :
                        'bg-warning/10 text-warning'}`}>
                    {application.status}
                  </span>
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {application.regularTime}</TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {application.time}</TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{application.by || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Controles de paginación */}
      <div className="flex justify-between items-center px-5 py-4 text-gray-800 text-theme-sm dark:text-gray-100 sm:justify-around">
        <div>
          <span className="hidden sm:inline">Page</span> {page}
          {total ? (
            <>
              <span className="hidden sm:inline"> of </span>
              <span className="sm:hidden">-</span> {/* Guion solo en pantallas pequeñas */}
              {Math.ceil(total / limit)}
            </>
          ) : ''}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            Prev
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setPage((p) => (total ? (p < Math.ceil(total / limit) ? p + 1 : p) : p + 1))}
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

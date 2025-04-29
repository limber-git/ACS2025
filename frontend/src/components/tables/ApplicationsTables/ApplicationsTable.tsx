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
import TableSkeleton from "../AttendanceTables/TableSkeleton";
import TablePagination from "../TablePagination";
import { formatDateEnglish } from "../../../utils/attendance/recordUtils";
import Button from "../../ui/button/Button";
import ApplicationDetailsModal from "./ApplicationDetailsModal";

export interface Application {
  applicationId: string;
  id: number;
  recordId: number;
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

export default function ApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [pagination, setPagination] = useState<{
    totalItems: number;
    totalPages: number;
  } | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const fetchApplications = async () => {
    const userId = user?.userId;
    if (!userId) {
      setError("No se encontró el usuario logueado.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.getApplicationsByUser(
        userId.toString(),
        page,
        limit
      );
      if (response && response.records) {
        setApplications(response.records);
        setPagination({
          totalItems: response.pagination.total || 0,
          totalPages: Math.ceil((response.pagination.totalPages || 0) / limit),
        });
      } else {
        setApplications([]);
        setPagination(null);
      }
    } catch (error: any) {
      setError(error.message || "Error al cargar las solicitudes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user, page, limit]);

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
              >
                Date
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Type
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Time
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                State
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {applications.map((application) => (
              <TableRow key={application.applicationId}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {formatDateEnglish(application.submissionDate)}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {application.type}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-sm font-medium ${
                      application.status === "Approved"
                        ? "bg-green-500 text-white"
                        : application.status === "Pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {application.status}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {application.time}
                </TableCell>
                <TableCell className="px-2 py-2 text-theme-sm text-gray-800 dark:text-gray-400">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedApplication(application);
                      setIsModalOpen(true);
                    }}
                  >
                    More...
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {applications.length > 0 && (
        <TablePagination
          page={page}
          total={pagination?.totalItems ?? 0}
          limit={limit}
          loading={loading}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      )}

      {/* Modal para ver detalles de la aplicación */}
      <ApplicationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        application={selectedApplication}
        onDeleted={() => {
          fetchApplications();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

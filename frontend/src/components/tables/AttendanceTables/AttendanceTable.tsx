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
import { useModal } from "../../../hooks/useModal";
import RequestModal from "./RequestModal";
import {
  ApplicationFormData,
  stylesTable,
} from "../../../utils/attendance/constants";
import {
  extractHour,
  formatDateEnglish,
} from "../../../utils/attendance/recordUtils";
import { AttendanceRecordCalculated } from "../../../utils/attendance/constants";

export default function AttendanceTable() {
  const [records, setRecords] = useState<AttendanceRecordCalculated[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState<number | null>(null);

  const [cache, setCache] = useState<
    Record<string, { records: AttendanceRecordCalculated[] }>
  >({});
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const [pagination, setPagination] = useState<{
    totalItems: number;
    totalPages: number;
  } | null>(null);

  const {
    isOpen: isRequestModalOpen,
    openModal: openRequestModal,
    closeModal: closeRequestModal,
  } = useModal();
  const [selectedRecord, setSelectedRecord] =
    useState<AttendanceRecordCalculated | null>(null);

  const fetchRecords = async (forceFetch: boolean = false) => {
    const userId = user?.userId;
    if (!userId) {
      setError("No se encontró el usuario logueado.");
      setLoading(false);
      return;
    }
    const cacheKey = `${page}-${limit}-${dateFilter?.startDate ?? "none"}-${
      dateFilter?.endDate ?? "none"
    }`;

    if (cache[cacheKey] && !forceFetch) {
      setRecords(cache[cacheKey].records);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.getAttendanceByUserCalculated(
        userId.toString(),
        page,
        limit,
        dateFilter?.startDate,
        dateFilter?.endDate
      );
      console.log("response", response);

      let newRecords: AttendanceRecordCalculated[] = [];
      if (Array.isArray(response)) {
        newRecords = response;
      } else {
        newRecords = response.records || [];
        setPagination(response.pagination || null);
      }

      setRecords(newRecords);

      setCache((prev) => ({
        ...prev,
        [cacheKey]: { records: newRecords },
      }));
    } catch (error: any) {
      setError(error.message || "Error al cargar los registros de asistencia.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSubmit = async (data: ApplicationFormData) => {
    const lt = "00:30:00";
    try {
      if (!selectedRecord) {
        throw new Error("No record selected");
      }
      await api.submitApplication({
        recordId: data.recordId,
        file: data.file,
        userId: data.userId,
        reason: data.reason,
        type: selectedRecord.situation,
        regularDate: selectedRecord.date,
        regularTime: selectedRecord.onDuty,
        time: selectedRecord.clockIn ? selectedRecord.late : lt,
      });

      await fetchRecords(true);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user, page, limit, dateFilter]);

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
    <>
      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={closeRequestModal}
        record={selectedRecord}
        onSubmit={handleApplicationSubmit}
      />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <DateRangeFilter
          onFilterChange={handleDateFilterChange}
          onReset={handleDateFilterReset}
        />
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className={stylesTable.className}>
                  Date
                </TableCell>
                <TableCell isHeader className={stylesTable.className}>
                  Schedule
                </TableCell>
                <TableCell isHeader className={stylesTable.className}>
                  Clock In
                </TableCell>
                <TableCell isHeader className={stylesTable.className}>
                  Clock Out
                </TableCell>
                <TableCell isHeader className={stylesTable.className}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {records.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-5 py-3 text-center text-gray-500"
                  >
                    {dateFilter
                      ? "No attendance records found for the selected date range."
                      : "There are no attendance records."}
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.recordId}>
                    <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {formatDateEnglish(record.date)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                      {extractHour(record.schedule)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-gray-100">
                      {record.clockIn}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-gray-100">
                      {record.clockOut}
                    </TableCell>
                    <TableCell className="px-2 py-2 text-theme-sm text-gray-800 dark:text-gray-400">
                      {record.needsApplication ? (
                        <Button
                          size="sm"
                          variant="outline"
                          color={
                            record.applicationId
                              ? record.applicationStatus === "Pending"
                                ? "warning"
                                : record.applicationStatus === "Approved"
                                ? "success"
                                : record.applicationStatus === "Rejected"
                                ? "error"
                                : "primary"
                              : "primary"
                          }
                          onClick={() => {
                            if (
                              !record.applicationId &&
                              record.needsApplication
                            ) {
                              setSelectedRecord(record);
                              openRequestModal();
                            }
                          }}
                        >
                          {record.applicationId
                            ? record.applicationStatus
                            : "Request"}
                        </Button>
                      ) : record.applicationId ? (
                        <Button
                          size="sm"
                          variant="outline"
                          color={
                            record.applicationStatus === "Pending"
                              ? "warning"
                              : record.applicationStatus === "Approved"
                              ? "success"
                              : record.applicationStatus === "Rejected"
                              ? "error"
                              : "default"
                          }
                          disabled
                        >
                          {record.applicationStatus}
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Controles de paginación */}
        {/* Controles de paginación */}
        {/* <div className="flex justify-between items-center px-5 py-4 text-gray-800 text-theme-sm dark:text-gray-100">
          <div>
            Page {page} {total ? `of ${Math.ceil(total / limit)}` : ""}
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
              onClick={() =>
                setPage((p) =>
                  total ? (p < Math.ceil(total / limit) ? p + 1 : p) : p + 1
                )
              }
              disabled={
                (!!total && page >= Math.ceil(total / limit)) || loading
              }
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
                onChange={(e) => {
                  setPage(1);
                  setLimit(Number(e.target.value));
                }}
                disabled={loading}
              >
                {[5, 10, 20, 50].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div> */}
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
    </>
  );
}

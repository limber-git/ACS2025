import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { TableSkeletonProps } from "../../../utils/attendance/constants";

export default function TableSkeleton({
  rows = 5,
  columns = ["Date", "Schedule", "Clock In", "Clock Out", "Actions"],
  showHeader = true,
}: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {showHeader && (
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {columns.map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
          )}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {[...Array(rows)].map((_, index) => (
              <TableRow key={index}>
                {columns.map((column, cellIndex) => (
                  <TableCell key={cellIndex} className="px-5 py-4">
                    {column === "Actions" ? (
                      <div
                        className="h-8 w-20 bg-gray-200 rounded-md animate-pulse dark:bg-gray-700"
                        aria-hidden="true"
                      />
                    ) : (
                      <div
                        className="h-4 bg-gray-200 rounded-md animate-pulse dark:bg-gray-700"
                        aria-hidden="true"
                        style={{
                          width:
                            column === "Date"
                              ? "250px"
                              : column === "Schedule"
                              ? "100px"
                              : column === "Clock In" || column === "Clock Out"
                              ? "80px"
                              : "100px",
                        }}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

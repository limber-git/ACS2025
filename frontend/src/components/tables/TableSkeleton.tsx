import Button from "../ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

interface TableSkeletonProps {
  rows?: number;
  columns?: string[];
}

export default function TableSkeleton({ 
  rows = 5, 
  columns = ['Date', 'Schedule', 'Clock In', 'Clock Out', 'Actions']
}: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
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
          <TableBody>
            {[...Array(rows)].map((_, index) => (
              <TableRow key={index}>
                {[...Array(columns.length)].map((_, cellIndex) => (
                  <TableCell key={cellIndex} className="px-5 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>

          {/* Controles de paginación */}
          <TableRow>
            <TableCell colSpan={columns.length} className="px-5 py-4 text-gray-800 text-theme-sm dark:text-gray-100 sm:justify-around">
              <div className="flex justify-between items-center">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={true}
                    className="opacity-50"
                  >
                    Prev
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={true}
                    className="opacity-50"
                  >
                    Next
                  </Button>
                </div>
                <div>
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                </div>

              </div>
            </TableCell>
          </TableRow>
        </Table>
      </div>
    </div>
  );
}

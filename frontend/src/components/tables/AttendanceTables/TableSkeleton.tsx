import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

interface TableSkeletonProps {
  rows?: number;
  columns?: string[];
  showHeader?: boolean;
}

export default function TableSkeleton({ 
  rows = 5, 
  columns = ['Date', 'Schedule', 'Clock In', 'Clock Out', 'Actions'],
  showHeader = true
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
                {columns.map((_, cellIndex) => (
                  <TableCell 
                    key={cellIndex} 
                    className={`px-${cellIndex === 0 ? '4' : '5'} py-${cellIndex === 0 ? '3' : '6'} text-gray-500 text-start text-theme-sm dark:text-gray-400`}
                  >
                    <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
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

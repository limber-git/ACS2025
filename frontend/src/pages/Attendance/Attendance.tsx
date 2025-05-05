import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AttendanceTable from "../../components/tables/AttendanceTables/AttendanceTable";

export default function Attendance() {
  return (
    <>
      <PageBreadcrumb pageTitle="Attendance Table" />
        <AttendanceTable />
    </>
  );
}

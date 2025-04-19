import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import AttendanceTable from "../../components/tables/AttendanceTable";

export default function BasicTables() {
  return (
    <>
      <PageBreadcrumb pageTitle="Attendance Table" />
      <div className="space-y-6">
        <ComponentCard title="Attendance">
          <AttendanceTable/>
        </ComponentCard>
      </div>
    </>
  );
}

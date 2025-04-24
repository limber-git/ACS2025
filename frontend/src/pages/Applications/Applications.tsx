import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import ApplicationsTable from "../../components/tables/ApplicationsTables/ApplicationsTable";

export default function Applications() {
  return (
    <>
      <PageBreadcrumb pageTitle="Applications Table" />
      <div className="space-y-6">
        <ComponentCard title="Applications">
          <ApplicationsTable />
        </ComponentCard>
      </div>
    </>
  );
}

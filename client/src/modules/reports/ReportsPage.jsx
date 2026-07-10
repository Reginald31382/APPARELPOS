import useDashboard from "./hooks/useDashboard";

import SummaryCards from "./components/SummaryCards";
import SalesChart from "./components/SalesChart";
import RecentOrdersTable from "./components/RecentOrdersTable";
import LowInventoryTable from "./components/LowInventoryTable";
import ReportFilters from "./components/ReportFilters";
import ExportButtons from "./components/ExportButtons";

const ReportsPage = () => {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8">Unable to load reports.</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-bold">Reports</h1>

        <ExportButtons orders={data.recentOrders} />
      </div>

      <ReportFilters />

      <SummaryCards data={data} />

      <SalesChart data={data.last7Days} />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentOrdersTable orders={data.recentOrders} />

        <LowInventoryTable products={data.lowInventoryProducts} />
      </div>
    </div>
  );
};

export default ReportsPage;

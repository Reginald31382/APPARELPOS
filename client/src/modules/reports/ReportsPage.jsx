import { useState } from "react";

import useReportSummary from "./hooks/useReportSummary";
import useSalesReport from "./hooks/useSalesReport";
import useOrdersReport from "./hooks/useOrdersReport";
import useInventoryReport from "./hooks/useInventoryReport";

import SummaryCards from "./components/SummaryCards";
import SalesChart from "./components/SalesChart";
import RecentOrdersTable from "./components/RecentOrdersTable";
import LowInventoryTable from "./components/LowInventoryTable";
import ReportFilters from "./components/ReportFilters";
import ExportButtons from "./components/ExportButtons";

const ReportsPage = () => {
  const [filters, setFilters] = useState({});

  const summary = useReportSummary(filters);
  const sales = useSalesReport(filters);
  const orders = useOrdersReport(filters);
  const inventory = useInventoryReport(filters);

  const isLoading =
    summary.isLoading ||
    sales.isLoading ||
    orders.isLoading ||
    inventory.isLoading;

  const error = summary.error || sales.error || orders.error || inventory.error;

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

        <ExportButtons orders={orders.data?.recentOrders ?? []} />
      </div>

      <ReportFilters filters={filters} onChange={setFilters} />

      <SummaryCards data={summary.data} />

      <SalesChart data={sales.data ?? []} />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentOrdersTable orders={orders.data?.recentOrders ?? []} />

        <LowInventoryTable products={inventory.data?.lowInventory ?? []} />
      </div>
    </div>
  );
};

export default ReportsPage;

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
import OrderStatusCard from "../../pages/reports/components/OrderStatusCard";

const ReportsPage = () => {
  const [filters, setFilters] = useState({
    range: "today",
  });

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
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-4">
        <p className="text-sm text-gray-500 sm:text-base">Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 sm:p-6">
        <h2 className="font-semibold text-red-700">Unable to load reports.</h2>
        <p className="mt-1 text-sm text-red-600">
          Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-5 sm:space-y-7 lg:space-y-8">
      {/* Page heading and exports */}
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Reports
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review sales, orders, and inventory performance.
          </p>
        </div>

        <div className="w-full min-w-0 lg:w-auto">
          <ExportButtons
            filters={filters}
            summary={summary.data}
            sales={sales.data}
            orders={orders.data}
            inventory={inventory.data}
          />
        </div>
      </div>

      {/* Report filters */}
      <section className="min-w-0 rounded-xl border bg-white p-3 shadow-sm sm:p-5">
        <ReportFilters filters={filters} onChange={setFilters} />
      </section>

      {/* Summary statistics */}
      <section className="min-w-0">
        <SummaryCards data={summary.data} />
      </section>

      {/* Sales chart */}
      <section className="min-w-0 overflow-hidden rounded-xl border bg-white p-3 shadow-sm sm:p-5">
        <SalesChart data={sales.data ?? []} range={filters.range} />
      </section>

      {/* Order status and low inventory */}
      <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-6">
        <div className="min-w-0 overflow-hidden">
          <OrderStatusCard statuses={orders.data?.statuses ?? []} />
        </div>

        <div className="min-w-0 overflow-hidden">
          <LowInventoryTable products={inventory.data?.lowInventory ?? []} />
        </div>
      </section>

      {/* Recent orders */}
      <section className="min-w-0 overflow-hidden rounded-xl border bg-white p-3 shadow-sm sm:p-5">
        <RecentOrdersTable orders={orders.data?.recentOrders ?? []} />
      </section>
    </div>
  );
};

export default ReportsPage;

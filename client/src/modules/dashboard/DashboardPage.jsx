import { CalendarDays } from "lucide-react";

import useDashboard from "./hooks/useDashboard";

import DashboardGrid from "./components/DashboardGrid";
import RecentOrders from "./components/RecentOrders";
import LowInventory from "./components/LowInventory";
import QuickActions from "../../pages/dashboard/components/QuickActions";
import RevenueSnapshot from "../../pages/dashboard/components/RevenueSnapshot";

const DashboardPage = () => {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return <p className="p-8">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome Back 👋</h1>

          <p className="mt-2 text-gray-500">
            Here's what's happening in your store today.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-3 shadow-sm">
          <CalendarDays size={18} />

          <span className="font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <DashboardGrid stats={data} />

      {/* Charts + Quick Actions */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueSnapshot />
        </div>

        <QuickActions />
      </div>

      {/* Tables */}
      <div className="grid gap-6 xl:grid-cols-2">
        <RecentOrders orders={data.recentOrders} />

        <LowInventory products={data.lowInventoryProducts} />
      </div>
    </div>
  );
};

export default DashboardPage;

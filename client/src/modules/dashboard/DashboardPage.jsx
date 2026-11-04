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
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-gray-500 sm:text-base">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-5 sm:space-y-7 lg:space-y-8">
      {/* Header */}
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            Welcome Back 👋
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Here's what's happening in your store today.
          </p>
        </div>

        <div className="flex w-fit max-w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm sm:px-4 sm:py-3">
          <CalendarDays size={18} className="shrink-0 text-gray-500" />

          <span className="font-medium text-gray-700">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="min-w-0">
        <DashboardGrid stats={data} />
      </section>

      {/* Revenue Chart + Quick Actions */}
      <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-6">
        <div className="min-w-0 xl:col-span-2">
          <RevenueSnapshot />
        </div>

        <div className="min-w-0">
          <QuickActions />
        </div>
      </section>

      {/* Recent Orders + Low Inventory */}
      <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-6">
        <div className="min-w-0">
          <RecentOrders orders={data?.recentOrders ?? []} />
        </div>

        <div className="min-w-0">
          <LowInventory products={data?.lowInventoryProducts ?? []} />
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;

import useDashboard from "./hooks/useDashboard";
import DashboardGrid from "./components/DashboardGrid";
import RecentOrders from "./components/RecentOrders";
import LowInventory from "./components/LowInventory";
// import SalesChart from "./components/SalesChart";

const DashboardPage = () => {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return <p className="p-8">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <DashboardGrid stats={data} />

      {/* <SalesChart data={data.last7days} /> */}

      <RecentOrders orders={data.recentOrders} />

      <LowInventory products={data.lowInventoryProducts} />
    </div>
  );
};

export default DashboardPage;

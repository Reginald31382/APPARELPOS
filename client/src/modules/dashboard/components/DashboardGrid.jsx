import DashboardCard from "./DashboardCard";

const DashboardGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <DashboardCard
        title="Today's Sales"
        value={`$${stats.todaySales.toFixed(2)}`}
      />

      <DashboardCard title="Orders Today" value={stats.ordersToday} />

      <DashboardCard title="Items Sold" value={stats.itemsSold} />

      <DashboardCard title="Low Inventory" value={stats.lowInventory} />
    </div>
  );
};

export default DashboardGrid;

import DashboardCard from "./DashboardCard";
import { formatCurrency } from "../../../utils/currency";

const DashboardGrid = ({ stats = {} }) => {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <DashboardCard
        title="Today's Sales"
        value={formatCurrency(stats.todaySales ?? 0)}
      />

      <DashboardCard title="Orders Today" value={stats.ordersToday ?? 0} />

      <DashboardCard title="Items Sold" value={stats.itemsSold ?? 0} />

      <DashboardCard title="Low Inventory" value={stats.lowInventory ?? 0} />
    </div>
  );
};

export default DashboardGrid;

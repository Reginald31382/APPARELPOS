import DashboardCard from "./DashboardCard";
import { formatCurrency } from "../../../utils/currency";

const DashboardGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <DashboardCard
        title="Today's Sales"
        value={formatCurrency(stats.todaySales)}
      />

      <DashboardCard title="Orders Today" value={stats.ordersToday} />

      <DashboardCard title="Items Sold" value={stats.itemsSold} />

      <DashboardCard title="Low Inventory" value={stats.lowInventory} />
    </div>
  );
};

export default DashboardGrid;

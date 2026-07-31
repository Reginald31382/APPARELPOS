import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import useSalesReport from "../../../modules/reports/hooks/useSalesReport";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const RevenueSnapshot = () => {
  const { data = [], isLoading } = useSalesReport({
    range: "last7",
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold">Revenue Snapshot</h2>

        <div className="flex h-[320px] items-center justify-center text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    label: new Date(item._id).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Revenue Snapshot</h2>

          <p className="text-sm text-gray-500">Last 7 Days</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Total Revenue</p>

          <p className="text-xl font-bold">
            {formatCurrency(data.reduce((sum, day) => sum + day.revenue, 0))}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="label" />

          <YAxis tickFormatter={(value) => `$${value}`} />

          <Tooltip formatter={(value) => [formatCurrency(value), "Revenue"]} />

          <Line
            dataKey="revenue"
            type="monotone"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueSnapshot;

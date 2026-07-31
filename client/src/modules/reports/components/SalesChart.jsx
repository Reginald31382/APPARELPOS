import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const SalesChart = ({ data, range }) => {
  const formatXAxis = (value) => {
    if (!value) return "";

    if (range === "today") {
      return value; // 08:00, 09:00...
    }

    if (range === "month" || range === "lastMonth") {
      const week = value.split("-")[1];
      return `Week ${Number(week)}`;
    }

    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTooltipLabel = (value) => {
    if (range === "today") return value;

    if (range === "month" || range === "lastMonth") {
      const week = value.split("-")[1];
      return `Week ${Number(week)}`;
    }

    return new Date(value).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Revenue Trend</h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="_id" tickFormatter={formatXAxis} />

          <YAxis tickFormatter={(value) => `$${value}`} />

          <Tooltip
            labelFormatter={formatTooltipLabel}
            formatter={(value) => [formatCurrency(value), "Revenue"]}
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 7 }}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;

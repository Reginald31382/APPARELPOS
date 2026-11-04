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

const SalesChart = ({ data = [], range }) => {
  const formatXAxis = (value) => {
    if (!value) return "";

    if (range === "today") {
      return value;
    }

    if (range === "month" || range === "lastMonth") {
      const week = value.split("-")[1];
      return `W${Number(week)}`;
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
    <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
          Revenue Trend
        </h2>

        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Revenue over the selected reporting period
        </p>
      </div>

      <div className="h-[260px] w-full min-w-0 sm:h-[320px] lg:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -15,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="_id"
              tickFormatter={formatXAxis}
              tick={{ fontSize: 11 }}
              tickMargin={8}
              minTickGap={20}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tickFormatter={(value) => `$${value}`}
              tick={{ fontSize: 11 }}
              width={65}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              labelFormatter={formatTooltipLabel}
              formatter={(value) => [formatCurrency(value), "Revenue"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
              }}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {data.length === 0 && (
        <p className="mt-3 text-center text-sm text-gray-500">
          No sales data available for this period.
        </p>
      )}
    </div>
  );
};

export default SalesChart;

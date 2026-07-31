const statusColors = {
  Completed: "bg-green-500",
  Pending: "bg-yellow-500",
  Cancelled: "bg-red-500",
  Refunded: "bg-blue-500",
};

const OrderStatusCard = ({ statuses = [] }) => {
  const total = statuses.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Order Status</h2>

      <div className="space-y-5">
        {statuses.map((status) => {
          const percent = total === 0 ? 0 : (status.count / total) * 100;

          return (
            <div key={status._id}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">{status._id}</span>

                <span className="text-sm text-gray-500">{status.count}</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full ${
                    statusColors[status._id] ?? "bg-blue-600"
                  }`}
                  style={{
                    width: `${percent}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusCard;

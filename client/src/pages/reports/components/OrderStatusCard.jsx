const statusColors = {
  Completed: "bg-green-500",
  Pending: "bg-yellow-500",
  Cancelled: "bg-red-500",
  Refunded: "bg-blue-500",
};

const OrderStatusCard = ({ statuses = [] }) => {
  const total = statuses.reduce((sum, status) => sum + status.count, 0);

  return (
    <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
            Order Status
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Order distribution by status
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
          {total} Total
        </span>
      </div>

      {statuses.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-500">
            No order status data available.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {statuses.map((status) => {
            const percent = total === 0 ? 0 : (status.count / total) * 100;

            return (
              <div key={status._id}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="break-words text-sm font-medium text-gray-800">
                    {status._id}
                  </span>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {status.count}
                    </span>

                    <span className="text-xs text-gray-400">
                      ({percent.toFixed(0)}%)
                    </span>
                  </div>
                </div>

                <div
                  className="h-3 overflow-hidden rounded-full bg-gray-100"
                  role="progressbar"
                  aria-label={`${status._id} orders`}
                  aria-valuenow={Math.round(percent)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
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
      )}
    </div>
  );
};

export default OrderStatusCard;

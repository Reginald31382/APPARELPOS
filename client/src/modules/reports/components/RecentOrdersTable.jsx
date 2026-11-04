import { formatCurrency } from "../../../utils/currency";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Refunded: "bg-red-100 text-red-800",
};

const RecentOrdersTable = ({ orders = [] }) => {
  return (
    <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
          Recent Orders
        </h2>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Overview of your latest customer orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500">
          No recent orders available.
        </div>
      ) : (
        <>
          {/* Mobile order cards */}
          <div className="space-y-3 md:hidden">
            {orders.map((order) => (
              <div
                key={order._id}
                className="min-w-0 rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Order</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      #{order._id.slice(-6)}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[order.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="mt-1 break-words font-semibold text-gray-900">
                      {formatCurrency(order.total)}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Payment</p>
                    <p className="mt-1 break-words text-sm text-gray-700">
                      {order.paymentMethod || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[600px] text-left">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                    Order
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                    Total
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      #{order._id.slice(-6)}
                    </td>

                    <td className="px-4 py-3">{formatCurrency(order.total)}</td>

                    <td className="px-4 py-3">
                      {order.paymentMethod || "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[order.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default RecentOrdersTable;

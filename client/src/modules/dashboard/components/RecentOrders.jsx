const RecentOrders = ({ orders = [] }) => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-bold">Recent Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No recent orders.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-semibold">{order.orderNumber}</p>

                <p className="text-sm text-gray-500">{order.paymentMethod}</p>
              </div>

              <div className="text-right">
                <p className="font-bold">${order.total.toFixed(2)}</p>

                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentOrders;

import { formatCurrency } from "../../../utils/currency";

const RecentOrdersTable = ({ orders }) => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Recent Orders</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b">
            <tr>
              <th className="py-3">Order</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="py-3">{order._id.slice(-6)}</td>

                <td>{formatCurrency(order.total)}</td>

                <td>{order.paymentMethod}</td>

                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;

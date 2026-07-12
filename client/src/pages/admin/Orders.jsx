import useOrderDrawerStore from "../../store/orders/useOrderDrawerStore";
import OrderDetailsModal from "../../modules/orders/components/OrderDetailsModal";

import useOrders from "../../modules/orders/hooks/useOrders";
import { useState } from "react";

import { formatCurrency } from "../../utils/currency";

const Orders = () => {
  const { data: orders = [], isLoading } = useOrders();

  const [search, setSearch] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return <p>Loading orders...</p>;
  }

  const filteredOrders = orders.filter((order) => {
    const customer = order.customer
      ? `${order.customer.firstName} ${order.customer.lastName}`
      : "Walk-in";

    return (
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      customer.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>

        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 rounded-lg border p-3"
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Order #</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Payment</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Total</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="p-4 font-medium">{order.orderNumber}</td>

                <td className="p-4">
                  {order.customer
                    ? `${order.customer.firstName} ${order.customer.lastName}`
                    : "Walk-in"}
                </td>

                <td className="p-4">{order.paymentMethod}</td>

                <td className="p-4">{order.status}</td>

                <td className="p-4 text-right font-semibold">
                  {formatCurrency(order.total)}
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsModalOpen(true);
                    }}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <OrderDetailsModal
          order={selectedOrder}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </div>
    </div>
  );
};

export default Orders;

import { useState } from "react";
import { formatCurrency } from "../../../utils/currency";
import OrderDetailsModal from "../../orders/components/OrderDetailsModal";
import useRefundOrder from "../../orders/hooks/useRefundOrder";

const RecentOrders = ({ orders = [] }) => {
  const { mutate: refundOrder } = useRefundOrder();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleModalChange = (open) => {
    setIsModalOpen(open);

    if (!open) {
      setSelectedOrder(null);
    }
  };

  const handleRefund = ({ orderId, reason }) => {
    refundOrder(
      { orderId, reason },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        },
      },
    );
  };

  return (
    <div className="min-w-0 rounded-xl border bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="mb-4 flex items-center justify-between gap-2 sm:mb-5">
        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
          Recent Orders
        </h2>

        <span className="text-xs text-gray-500 sm:text-sm">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg bg-gray-50 px-4 py-8 text-center">
          <p className="text-sm text-gray-500">No recent orders.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <button
              key={order._id}
              type="button"
              onClick={() => handleOrderClick(order)}
              className="flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border p-3 text-left transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                  {order.orderNumber}
                </p>

                <p className="mt-1 truncate text-xs text-gray-500 sm:text-sm">
                  {order.paymentMethod}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-gray-900 sm:text-base">
                  {formatCurrency(order.total)}
                </p>

                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <OrderDetailsModal
        order={selectedOrder}
        open={isModalOpen}
        onOpenChange={handleModalChange}
        onRefund={handleRefund}
      />
    </div>
  );
};

export default RecentOrders;

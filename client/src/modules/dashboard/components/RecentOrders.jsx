import { useState } from "react";
import { formatCurrency } from "../../../utils/currency";
import OrderDetailsModal from "../../orders/components/OrderDetailsModal";
import useRefundOrder from "../../orders/hooks/useRefundOrder";

const RecentOrders = ({ orders = [] }) => {
  const { mutate: refundOrder } = useRefundOrder();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
              onClick={() => {
                setSelectedOrder(order);
                setIsModalOpen(true);
              }}
              className="flex cursor-pointer items-center justify-between rounded-lg border p-3 transition hover:bg-gray-50"
            >
              <div>
                <p className="font-semibold">{order.orderNumber}</p>

                <p className="text-sm text-gray-500">{order.paymentMethod}</p>
              </div>

              <div className="text-right">
                <p className="font-bold">{formatCurrency(order.total)}</p>

                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          <OrderDetailsModal
            order={selectedOrder}
            open={isModalOpen}
            onOpenChange={(open) => {
              setIsModalOpen(open);

              if (!open) {
                setSelectedOrder(null);
              }
            }}
            onRefund={({ orderId, reason }) => {
              refundOrder(
                { orderId, reason },
                {
                  onSuccess: () => {
                    setIsModalOpen(false);
                    setSelectedOrder(null);
                  },
                },
              );
            }}
          />
        </div>
      )}
    </div>
  );
};

export default RecentOrders;

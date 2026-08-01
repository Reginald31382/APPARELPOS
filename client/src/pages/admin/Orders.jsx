import { useQueryClient } from "@tanstack/react-query";
import socket from "../../services/socketService";
import OrderDetailsModal from "../../modules/orders/components/OrderDetailsModal";
import useOrders from "../../modules/orders/hooks/useOrders";
import useRefundOrder from "../../modules/orders/hooks/useRefundOrder";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { formatCurrency } from "../../utils/currency";

const Orders = () => {
  const { data: orders = [], isLoading } = useOrders();

  const { mutate: refundOrder } = useRefundOrder();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("Incoming");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (orders.length === 0) return;

    const orderId = searchParams.get("order");

    if (!orderId) return;

    const order = orders.find((o) => o._id === orderId);

    if (!order) return;
    setStatusFilter("All");
    setSelectedOrder(order);
    setIsModalOpen(true);

    // Remove the query parameter so refreshing the page
    // doesn't keep reopening the modal.
    setSearchParams({});
  }, [orders, searchParams, setSearchParams]);

  useEffect(() => {
    const refreshOrders = (order) => {
      console.log("📦 Socket Update:", order);

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORDERS],
      });
    };

    socket.on("order:new", refreshOrders);
    socket.on("order:updated", refreshOrders);
    socket.on("order:refunded", refreshOrders);

    return () => {
      socket.off("order:new", refreshOrders);
      socket.off("order:updated", refreshOrders);
      socket.off("order:refunded", refreshOrders);
    };
  }, [queryClient]);

  if (isLoading) {
    return <p>Loading orders...</p>;
  }

  const filteredOrders = orders.filter((order) => {
    const customer = order.customer
      ? `${order.customer.firstName} ${order.customer.lastName}`
      : "Walk-in";

    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      customer.toLowerCase().includes(search.toLowerCase());

    let matchesStatus = true;

    switch (statusFilter) {
      case "Incoming":
        matchesStatus =
          order.status === "Pending" || order.status === "Processing";
        break;

      case "Processing":
        matchesStatus = order.status === "Processing";
        break;

      case "Shipped":
        matchesStatus = order.status === "Shipped";
        break;

      case "Delivered":
        matchesStatus = order.status === "Delivered";
        break;

      case "Refunded":
        matchesStatus = order.status === "Refunded";
        break;

      default:
        matchesStatus = true;
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "All",
              "Incoming",
              "Processing",
              "Shipped",
              "Delivered",
              "Refunded",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  statusFilter === status
                    ? "bg-black text-white"
                    : "border bg-white hover:bg-gray-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border p-3 lg:w-80"
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

                <td className="p-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Shipped"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Refunded"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

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
    </div>
  );
};

export default Orders;

import { useQueryClient } from "@tanstack/react-query";
import socket from "../../services/socketService";
import OrderDetailsModal from "../../modules/orders/components/OrderDetailsModal";
import useOrders from "../../modules/orders/hooks/useOrders";
import useOrderStats from "../../modules/orders/hooks/useOrderStats";
import useRefundOrder from "../../modules/orders/hooks/useRefundOrder";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { formatCurrency } from "../../utils/currency";
import { deleteOrder } from "../../modules/orders/services/orderService";
import { ShoppingCart, DollarSign, Package, Trash2 } from "lucide-react";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Refunded: "bg-red-100 text-red-800",
};

const Orders = () => {
  const { data: orders = [], isLoading } = useOrders();
  const { data: stats } = useOrderStats();
  const { mutate: refundOrder } = useRefundOrder();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Incoming");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const handleDeleteOrder = (order) => {
    const confirmed = window.confirm(
      `Delete order ${order.orderNumber}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    deleteOrder(order._id)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ORDERS],
        });

        window.alert(`Order ${order.orderNumber} deleted successfully.`);
      })
      .catch((error) => {
        window.alert(
          error.response?.data?.message || "Unable to delete this order.",
        );
      });
  };

  useEffect(() => {
    if (orders.length === 0) return;

    const orderId = searchParams.get("order");

    if (!orderId) return;

    const order = orders.find((o) => o._id === orderId);

    if (!order) return;

    setStatusFilter("All");
    setSelectedOrder(order);
    setIsModalOpen(true);
    setSearchParams({});
  }, [orders, searchParams, setSearchParams]);

  useEffect(() => {
    const refreshOrders = () => {
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

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <p className="p-4 text-gray-500">Loading orders...</p>;
  }

  const filters = [
    "All",
    "Incoming",
    "Processing",
    "Shipped",
    "Delivered",
    "Refunded",
  ];

  const StatCard = ({ title, value, icon: Icon, color, background }) => (
    <div
      className={`min-w-0 rounded-xl border p-4 shadow-sm sm:p-5 ${background}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-gray-500 sm:text-sm">{title}</p>
          <h2 className="mt-2 break-words text-2xl font-bold text-gray-900 sm:text-3xl">
            {value}
          </h2>
        </div>
        <Icon className={`h-7 w-7 shrink-0 sm:h-9 sm:w-9 ${color}`} />
      </div>
    </div>
  );

  const OrderActions = ({ order }) => (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => handleViewOrder(order)}
        className="min-h-10 flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:flex-none"
      >
        View Order
      </button>

      <button
        type="button"
        onClick={() => handleDeleteOrder(order)}
        disabled={order.paymentStatus === "Paid"}
        title={
          order.paymentStatus === "Paid"
            ? "Paid orders cannot be deleted"
            : "Delete order"
        }
        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
      >
        <Trash2 size={16} />
        Delete
      </button>
    </div>
  );

  return (
    <div className="min-w-0 space-y-5 sm:space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and track customer orders.
        </p>
      </div>

      {/* Order statistics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders ?? 0}
          icon={ShoppingCart}
          color="text-blue-600"
          background="border-blue-100 bg-gradient-to-br from-blue-50 to-white"
        />

        <StatCard
          title="Today's Revenue"
          value={formatCurrency(stats?.revenueToday ?? 0)}
          icon={DollarSign}
          color="text-green-600"
          background="border-green-100 bg-gradient-to-br from-green-50 to-white"
        />

        <StatCard
          title="Today's Orders"
          value={stats?.todaysOrders ?? 0}
          icon={Package}
          color="text-purple-600"
          background="col-span-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white sm:col-span-1"
        />
      </div>

      {/* Search and filters */}
      <div className="space-y-4 rounded-xl border bg-white p-4 shadow-sm sm:p-5">
        <div>
          <label
            htmlFor="order-search"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Search Orders
          </label>

          <input
            id="order-search"
            type="text"
            placeholder="Search order number or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">
            Filter by status
          </p>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                  statusFilter === status
                    ? "bg-black text-white"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
          Order List
        </h2>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 sm:text-sm">
          {filteredOrders.length} orders
        </span>
      </div>

      {/* Mobile order cards */}
      <div className="space-y-3 md:hidden">
        {filteredOrders.map((order) => {
          const customer = order.customer
            ? `${order.customer.firstName} ${order.customer.lastName}`
            : "Walk-in";

          return (
            <div
              key={order._id}
              className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500">
                    Order Number
                  </p>
                  <h3 className="mt-1 break-all font-bold text-gray-900">
                    {order.orderNumber}
                  </h3>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyles[order.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="my-4 grid grid-cols-2 gap-4 border-y border-gray-100 py-4">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="mt-1 break-words text-sm font-medium text-gray-900">
                    {customer}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Payment</p>
                  <p className="mt-1 break-words text-sm font-medium text-gray-900">
                    {order.paymentMethod || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Payment Status</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {order.paymentStatus || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Order Total</p>
                  <p className="mt-1 text-base font-bold text-gray-900">
                    {formatCurrency(order.total)}
                  </p>
                </div>
              </div>

              <OrderActions order={order} />
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-500">
            No orders found.
          </div>
        )}
      </div>

      {/* Desktop orders table */}
      <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left text-sm font-semibold">Order #</th>
                <th className="p-4 text-left text-sm font-semibold">
                  Customer
                </th>
                <th className="p-4 text-left text-sm font-semibold">Payment</th>
                <th className="p-4 text-left text-sm font-semibold">Status</th>
                <th className="p-4 text-right text-sm font-semibold">Total</th>
                <th className="p-4 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t transition hover:bg-gray-50"
                >
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
                        statusStyles[order.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-4 text-right font-semibold">
                    {formatCurrency(order.total)}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewOrder(order)}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(order)}
                        disabled={order.paymentStatus === "Paid"}
                        title={
                          order.paymentStatus === "Paid"
                            ? "Paid orders cannot be deleted"
                            : "Delete order"
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
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
        </div>
      </div>

      {/* Order details and refund modal */}
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
  );
};

export default Orders;

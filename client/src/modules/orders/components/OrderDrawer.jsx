import useOrderDrawerStore from "../../store/orders/useOrderDrawerStore";

import ResponsiveDrawer from "../../components/layout/ResponsiveDrawer";

import { formatCurrency } from "../../utils/currency";

const OrderDrawer = () => {
  const order = useOrderDrawerStore((state) => state.order);

  const isOpen = useOrderDrawerStore((state) => state.isOpen);

  const closeOrder = useOrderDrawerStore((state) => state.closeOrder);

  if (!order) return null;

  return (
    <ResponsiveDrawer open={isOpen} onClose={closeOrder} width="500px">
      <div className="flex h-full flex-col bg-white">
        <div className="relative border-b p-5">
          <h2 className="text-2xl font-bold">Order Details</h2>

          <button
            onClick={closeOrder}
            className="absolute right-5 top-5 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div>
            <h3 className="font-semibold">Order Number</h3>

            <div className="mt-1 flex items-center gap-3">
              <p className="text-lg font-bold">{order.orderNumber}</p>

              <OrderTypeBadge type={order.orderType} />
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Customer</h3>

            <p>
              {order.customer
                ? `${order.customer.firstName} ${order.customer.lastName}`
                : "Walk-in Customer"}
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Payment</h3>

            <p>{order.paymentMethod}</p>
          </div>

          <div>
            <h3 className="font-semibold">Status</h3>

            <p>{order.status}</p>
          </div>
          {order.orderType === "Online" && (
            <>
              <div>
                <h3 className="font-semibold">Shipping Method</h3>

                <p>
                  {order.shipping.carrier} • {order.shipping.service}
                </p>
              </div>

              <div>
                <h3 className="font-semibold">Tracking</h3>

                <p>{order.shipping.trackingNumber || "Pending"}</p>
              </div>
            </>
          )}
          <div>
            <h3 className="mb-3 font-semibold">Items</h3>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.sku} className="rounded-lg border p-3">
                  <p className="font-semibold">{item.name}</p>

                  <p className="text-sm text-gray-500">
                    {item.color} • {item.size}
                  </p>

                  <p>Qty: {item.quantity}</p>

                  <p>{formatCurrency(item.unitPrice)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-gray-100 p-4">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>{formatCurrency(order.subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>

              <span>{formatCurrency(order.tax)}</span>
            </div>

            <div className="mt-2 flex justify-between text-lg font-bold">
              <span>Total</span>

              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveDrawer>
  );
};

export default OrderDrawer;

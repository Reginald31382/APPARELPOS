import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { formatCurrency } from "../../../utils/currency";

const OrderDetailsModal = ({ order, open, onOpenChange }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order {order.orderNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
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

              <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                {order.paymentMethod}
              </span>
            </div>

            <div>
              <h3 className="font-semibold">Status</h3>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium
    ${
      order.status === "Paid"
        ? "bg-green-100 text-green-700"
        : order.status === "Refunded"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-700"
    }
  `}
              >
                {order.status}
              </span>
            </div>

            <div>
              <h3 className="font-semibold">Date</h3>

              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
              item(s)
            </p>
            <h3 className="mb-3 text-lg font-semibold">Items Purchased</h3>

            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full min-w-700px">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Product</th>{" "}
                    <th className="p-3">Color</th>
                    <th className="p-3">Size</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3 text-right">Price</th>
                  </tr>
                </thead>

                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.sku} className="border-t">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded object-cover"
                          />

                          <div>
                            <p className="font-medium">{item.name}</p>

                            <p className="text-xs text-gray-500">{item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">{item.color}</td>

                      <td className="p-3 text-center">{item.size}</td>

                      <td className="p-3 text-center">{item.quantity}</td>

                      <td className="p-3 text-right">
                        {formatCurrency(item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg bg-gray-100 p-5">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>{formatCurrency(order.subtotal)}</span>
            </div>

            <div className="mt-2 flex justify-between">
              <span>Tax</span>

              <span>{formatCurrency(order.tax)}</span>
            </div>

            <div className="mt-4 flex justify-between text-xl font-bold">
              <span>Total</span>

              <span>{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-end gap-3 border-t pt-6">
              <button className="rounded-lg border px-4 py-2 hover:bg-gray-100">
                Print Receipt
              </button>

              {order.status !== "Refunded" && (
                <button className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                  Refund Order
                </button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;

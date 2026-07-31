import RefundOrderModal from "../../refunds/RefundOrderModal";
import UpdateStatusModal from "./UpdateStatusModal";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useReceiptStore from "../../../store/receipt/useReceiptStore";
import { formatCurrency } from "../../../utils/currency";

const OrderDetailsModal = ({ order, open, onOpenChange, onRefund }) => {
  const [refundOpen, setRefundOpen] = useState(false);
  const openReceipt = useReceiptStore((state) => state.openReceipt);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  if (!order) return null;
  const handlePrintReceipt = () => {
    openReceipt({
      _id: order._id,
      customer: order.customer,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      paymentMethod: order.paymentMethod,

      // Include discount information if it exists
      discount: order.discount || {
        amount: 0,
        reason: "",
      },
    });
  };
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

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  {order.paymentMethod}
                </span>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    order.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-700"
                      : order.paymentStatus === "Refunded"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Status</h3>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
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
                    <th className="p-3 text-left">Product</th>
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
                            src={item.images?.[0] || "/placeholder-product.png"}
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
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <>
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>

                  <span>-{formatCurrency(order.discount)}</span>
                </div>

                {order.discountReason && (
                  <div className="pl-2 text-sm italic text-gray-500">
                    {order.discountReason}
                  </div>
                )}
              </>
            )}
            <div className="mt-2 flex justify-between">
              <span>Tax</span>

              <span>{formatCurrency(order.tax)}</span>
            </div>

            <div className="mt-4 flex justify-between text-xl font-bold">
              <span>Total</span>

              <span>{formatCurrency(order.total)}</span>
            </div>
            {order.refund?.refundedAt && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <h3 className="mb-3 font-semibold text-red-700">
                  Refund Information
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Refund Amount</span>

                    <span>{formatCurrency(order.refund.amount)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Reason</span>

                    <span>{order.refund.reason}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Refunded On</span>

                    <span>
                      {new Date(order.refund.refundedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3 border-t pt-6">
              <button
                onClick={handlePrintReceipt}
                className="rounded-lg border px-4 py-2 hover:bg-gray-100"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setStatusModalOpen(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Update Status
              </button>
              {order.status !== "Refunded" && (
                <button
                  onClick={() => setRefundOpen(true)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Refund Order
                </button>
              )}
            </div>
          </div>
        </div>
        <UpdateStatusModal
          order={order}
          open={statusModalOpen}
          onOpenChange={setStatusModalOpen}
        />
        <RefundOrderModal
          order={order}
          open={refundOpen}
          onOpenChange={setRefundOpen}
          onRefund={(data) => {
            onRefund(data);
            setRefundOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;

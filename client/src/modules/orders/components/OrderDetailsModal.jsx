import api from "../../../api/axios";
import { notifySuccess, notifyError } from "../../../utils/notifications";
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
import OrderTimeline from "./OrderTimeline";

const OrderDetailsModal = ({ order, open, onOpenChange, onRefund }) => {
  const [refundOpen, setRefundOpen] = useState(false);
  const openReceipt = useReceiptStore((state) => state.openReceipt);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [purchasingLabel, setPurchasingLabel] = useState(false);

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
      discount: order.discount || {
        amount: 0,
        reason: "",
      },
    });
  };

  const handlePurchaseLabel = async () => {
    try {
      setPurchasingLabel(true);

      const { data } = await api.post(`/shipping/purchase-label/${order._id}`);

      Object.assign(order, data);

      notifySuccess("Shipping label purchased!");
    } catch (error) {
      console.error(error);

      notifyError(
        error.response?.data?.message || "Unable to purchase shipping label.",
      );
    } finally {
      setPurchasingLabel(false);
    }
  };

  const customerName = order.customer
    ? `${order.customer.firstName} ${order.customer.lastName}`
    : "Walk-in Customer";

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-blue-100 text-blue-800",
    Shipped: "bg-purple-100 text-purple-800",
    Delivered: "bg-green-100 text-green-800",
    Refunded: "bg-red-100 text-red-800",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95dvh] w-[calc(100%-1rem)] max-w-6xl flex-col overflow-hidden p-4 sm:w-[95vw] sm:p-6">
        <DialogHeader className="shrink-0 border-b pb-4 pr-6">
          <DialogTitle className="break-all text-lg font-bold sm:text-2xl">
            Order {order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain py-4 sm:space-y-6">
          {/* Order information */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="min-w-0 rounded-lg bg-gray-50 p-3 sm:p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Customer
              </h3>
              <p className="mt-2 break-words font-medium text-gray-900">
                {customerName}
              </p>
            </div>

            <div className="min-w-0 rounded-lg bg-gray-50 p-3 sm:p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Payment
              </h3>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  {order.paymentMethod}
                </span>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
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

            <div className="min-w-0 rounded-lg bg-gray-50 p-3 sm:p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Order Status
              </h3>

              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  statusStyles[order.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="min-w-0 rounded-lg bg-gray-50 p-3 sm:p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Order Date
              </h3>

              <p className="mt-2 break-words text-sm font-medium text-gray-900">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </section>

          {/* Purchased products */}
          <section>
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Items Purchased
              </h3>
              <p className="text-sm text-gray-500">{totalItems} item(s)</p>
            </div>

            {/* Mobile product cards */}
            <div className="space-y-3 md:hidden">
              {order.items.map((item, index) => (
                <div
                  key={item.sku || `${item.name}-${index}`}
                  className="flex min-w-0 gap-3 rounded-lg border p-3"
                >
                  <img
                    src={item.images?.[0] || "/placeholder-product.png"}
                    alt={item.name}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-semibold text-gray-900">
                      {item.name || "Product"}
                    </p>

                    <p className="mt-1 break-all text-xs text-gray-500">
                      SKU: {item.sku || "N/A"}
                    </p>

                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <p>Color: {item.color || "N/A"}</p>
                      <p>Size: {item.size || "N/A"}</p>
                      <p>Qty: {item.quantity}</p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop product table */}
            <div className="hidden overflow-x-auto rounded-lg border md:block">
              <table className="w-full min-w-[650px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left text-sm">Product</th>
                    <th className="p-3 text-center text-sm">Color</th>
                    <th className="p-3 text-center text-sm">Size</th>
                    <th className="p-3 text-center text-sm">Qty</th>
                    <th className="p-3 text-right text-sm">Price</th>
                  </tr>
                </thead>

                <tbody>
                  {order.items.map((item, index) => (
                    <tr
                      key={item.sku || `${item.name}-${index}`}
                      className="border-t"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.images?.[0] || "/placeholder-product.png"}
                            alt={item.name}
                            className="h-12 w-12 rounded object-cover"
                          />

                          <div className="min-w-0">
                            <p className="font-medium">
                              {item.name || "Product"}
                            </p>
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
          </section>

          {/* Shipping */}
          <section className="rounded-lg border bg-white p-4 sm:p-5">
            <h3 className="mb-4 text-lg font-semibold">Shipping</h3>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
              <div className="min-w-0">
                <p className="text-xs uppercase text-gray-500">Carrier</p>
                <p className="mt-1 break-words text-sm font-medium">
                  {order.shipping?.carrier || "N/A"}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xs uppercase text-gray-500">Service</p>
                <p className="mt-1 break-words text-sm font-medium">
                  {order.shipping?.service || "N/A"}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xs uppercase text-gray-500">Status</p>
                <span className="mt-1 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                  {order.shipping?.status || "N/A"}
                </span>
              </div>

              <div className="min-w-0">
                <p className="text-xs uppercase text-gray-500">
                  Tracking Number
                </p>

                <p className="mt-1 break-all font-mono text-xs sm:text-sm">
                  {order.shipping?.trackingNumber || "Not Purchased"}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {!order.shipping?.trackingNumber ? (
                <button
                  type="button"
                  onClick={handlePurchaseLabel}
                  disabled={purchasingLabel}
                  className="min-h-11 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-400 sm:w-auto"
                >
                  {purchasingLabel ? "Purchasing..." : "Purchase USPS Label"}
                </button>
              ) : (
                <>
                  <a
                    href={order.shipping.labelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    View Shipping Label
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        order.shipping.trackingNumber,
                      )
                    }
                    className="min-h-11 rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Copy Tracking
                  </button>

                  <a
                    href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.shipping.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center justify-center rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Track USPS
                  </a>
                </>
              )}
            </div>
          </section>

          {/* Order timeline */}
          <section className="min-w-0 overflow-hidden">
            <OrderTimeline timeline={order.timeline} />
          </section>

          {/* Order summary */}
          <section className="rounded-lg bg-gray-100 p-4 sm:p-5">
            <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>

              {order.discount > 0 && (
                <>
                  <div className="flex justify-between gap-4 text-green-700">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>

                  {order.discountReason && (
                    <p className="text-right text-xs italic text-gray-500">
                      {order.discountReason}
                    </p>
                  )}
                </>
              )}

              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">{formatCurrency(order.tax)}</span>
              </div>

              <div className="flex justify-between gap-4 border-t pt-4 text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>

            {/* Refund information */}
            {order.refund?.refundedAt && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
                <h3 className="mb-3 font-semibold text-red-700">
                  Refund Information
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span>Refund Amount</span>
                    <span className="font-medium">
                      {formatCurrency(order.refund.amount)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Reason</span>
                    <span className="text-right">{order.refund.reason}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Refunded On</span>
                    <span className="text-right">
                      {new Date(order.refund.refundedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Order actions */}
            <div className="mt-5 grid grid-cols-1 gap-2 border-t pt-5 sm:grid-cols-2 lg:flex lg:flex-wrap lg:justify-end">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="min-h-11 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-100"
              >
                Print Receipt
              </button>

              <button
                type="button"
                onClick={() => setStatusModalOpen(true)}
                className="min-h-11 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Update Status
              </button>

              {order.status !== "Refunded" && (
                <button
                  type="button"
                  onClick={() => setRefundOpen(true)}
                  className="min-h-11 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Refund Order
                </button>
              )}
            </div>
          </section>
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

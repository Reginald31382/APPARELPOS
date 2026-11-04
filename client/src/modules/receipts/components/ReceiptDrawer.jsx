import ResponsiveDrawer from "../../../components/layout/ResponsiveDrawer";
import useReceiptDrawerStore from "../store/useReceiptDrawerStore";
import PaymentMethodBadge from "./PaymentMethodBadge";
import { formatCurrency } from "../../../utils/currency";

const ReceiptDrawer = () => {
  const receipt = useReceiptDrawerStore((state) => state.receipt);
  const isOpen = useReceiptDrawerStore((state) => state.isOpen);
  const closeReceipt = useReceiptDrawerStore((state) => state.closeReceipt);

  if (!receipt) return null;

  return (
    <ResponsiveDrawer open={isOpen} onClose={closeReceipt} width="550px">
      <div className="flex h-full min-h-0 flex-col bg-white">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b p-4 sm:p-6">
          <h2 className="min-w-0 break-words text-xl font-bold text-gray-900 sm:text-2xl">
            Receipt {receipt.receiptNumber}
          </h2>

          <button
            type="button"
            onClick={closeReceipt}
            aria-label="Close receipt"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-2xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:space-y-6 sm:p-6">
          {/* Receipt Information */}
          <div className="space-y-3 rounded-lg bg-gray-50 p-3 text-sm sm:p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 text-gray-500">Order</span>
              <span className="break-words text-right font-semibold">
                {receipt.order?.orderNumber || "—"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 text-gray-500">Customer</span>
              <span className="min-w-0 break-all text-right">
                {receipt.customerEmail || "Walk-In Customer"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="shrink-0 text-gray-500">Payment</span>
              <PaymentMethodBadge method={receipt.paymentMethod} />
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-500">Order Type</span>
              <span className="font-medium">{receipt.orderType}</span>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="mb-3 text-base font-semibold text-gray-900 sm:mb-4 sm:text-lg">
              Items
            </h3>

            <div className="space-y-3">
              {(receipt.items ?? []).map((item, index) => (
                <div
                  key={item._id || item.sku || index}
                  className="rounded-lg border p-3 sm:p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-semibold text-gray-900 sm:text-base">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                        {item.color || "—"} • {item.size || "—"}
                      </p>

                      <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-gray-900 sm:text-base">
                      {formatCurrency(
                        Number(item.quantity) * Number(item.unitPrice),
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="rounded-lg bg-gray-100 p-4 sm:p-5">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(receipt.subtotal)}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-600">Tax</span>
                <span>{formatCurrency(receipt.tax)}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-600">Shipping</span>
                <span>{formatCurrency(receipt.shipping)}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-600">Discount</span>
                <span>{formatCurrency(receipt.discount)}</span>
              </div>
            </div>

            <hr className="my-4 border-gray-300" />

            <div className="flex items-center justify-between gap-3 text-lg font-bold sm:text-xl">
              <span>Total</span>
              <span>{formatCurrency(receipt.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t bg-white p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button
              type="button"
              className="rounded-lg border px-2 py-3 text-sm font-semibold transition hover:bg-gray-100 sm:text-base"
            >
              Print
            </button>

            <button
              type="button"
              className="rounded-lg border px-2 py-3 text-sm font-semibold transition hover:bg-gray-100 sm:text-base"
            >
              Download PDF
            </button>

            <button
              type="button"
              className="rounded-lg border px-2 py-3 text-sm font-semibold transition hover:bg-gray-100 sm:text-base"
            >
              Email Receipt
            </button>

            <button
              type="button"
              className="rounded-lg bg-black px-2 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:text-base"
            >
              Refund
            </button>
          </div>
        </div>
      </div>
    </ResponsiveDrawer>
  );
};

export default ReceiptDrawer;

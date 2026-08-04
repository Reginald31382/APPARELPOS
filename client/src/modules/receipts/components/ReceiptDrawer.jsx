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
      <div className="flex h-full flex-col bg-white">
        {/* Header */}
        <div className="relative border-b p-6">
          <h2 className="text-2xl font-bold">
            Receipt {receipt.receiptNumber}
          </h2>

          <button
            onClick={closeReceipt}
            className="absolute right-6 top-6 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between">
              <span>Order</span>

              <span className="font-semibold">
                {receipt.order?.orderNumber}
              </span>
            </div>

            <div className="mt-2 flex justify-between">
              <span>Customer</span>

              <span>{receipt.customerEmail || "Walk-In Customer"}</span>
            </div>

            <div className="mt-2 flex justify-between">
              <span>Payment</span>
              <PaymentMethodBadge method={receipt.paymentMethod} />
            </div>

            <div className="mt-2 flex justify-between">
              <span>Order Type</span>

              <span>{receipt.orderType}</span>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Items</h3>

            <div className="space-y-3">
              {receipt.items.map((item) => (
                <div key={item.sku} className="rounded-lg border p-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{item.name}</p>

                      <p className="text-sm text-gray-500">
                        {item.color} • {item.size}
                      </p>

                      <p className="text-sm">Qty {item.quantity}</p>
                    </div>

                    <p className="font-semibold">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}

          <div className="rounded-lg bg-gray-100 p-5">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>{formatCurrency(receipt.subtotal)}</span>
            </div>

            <div className="mt-2 flex justify-between">
              <span>Tax</span>

              <span>{formatCurrency(receipt.tax)}</span>
            </div>

            <div className="mt-2 flex justify-between">
              <span>Shipping</span>

              <span>{formatCurrency(receipt.shipping)}</span>
            </div>

            <div className="mt-2 flex justify-between">
              <span>Discount</span>

              <span>{formatCurrency(receipt.discount)}</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>

              <span>{formatCurrency(receipt.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="border-t p-6">
          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-lg border py-3 font-semibold hover:bg-gray-100">
              Print
            </button>

            <button className="rounded-lg border py-3 font-semibold hover:bg-gray-100">
              Download PDF
            </button>

            <button className="rounded-lg border py-3 font-semibold hover:bg-gray-100">
              Email Receipt
            </button>

            <button className="rounded-lg bg-black py-3 font-semibold text-white">
              Refund
            </button>
          </div>
        </div>
      </div>
    </ResponsiveDrawer>
  );
};

export default ReceiptDrawer;

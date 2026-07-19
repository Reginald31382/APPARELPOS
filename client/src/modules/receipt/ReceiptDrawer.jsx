import useReceiptStore from "../../store/receipt/useReceiptStore";

import ReceiptHeader from "./ReceiptHeader";
import ReceiptItems from "./ReceiptItems";
import ReceiptTotals from "./ReceiptTotals";
import ReceiptFooter from "./ReceiptFooter";
import useReceiptPrint from "./hooks/useReceiptPrint";
import EmailReceiptButton from "./EmailReceiptButton";

const ReceiptDrawer = () => {
  const receipt = useReceiptStore((state) => state.receipt);

  const isOpen = useReceiptStore((state) => state.isOpen);

  const closeReceipt = useReceiptStore((state) => state.closeReceipt);

  const { printReceipt } = useReceiptPrint();

  if (!isOpen || !receipt) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50">
      <div className="absolute right-0 top-0 flex h-full w-[500px] flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-2xl font-bold">Receipt</h2>

          <button onClick={closeReceipt} className="text-2xl">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <ReceiptHeader />

          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 font-semibold">Customer</h3>

            <p>
              {receipt.customer?.firstName && receipt.customer?.lastName
                ? `${receipt.customer.firstName} ${receipt.customer.lastName}`
                : "Walk-in Customer"}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 font-semibold">Payment</h3>

            <p>{receipt.paymentMethod}</p>
          </div>

          <ReceiptItems items={receipt.items} />

          <ReceiptTotals
            subtotal={receipt.subtotal}
            discount={receipt.discount?.amount || 0}
            discountReason={receipt.discount?.reason || ""}
            tax={receipt.tax}
            total={receipt.total}
          />

          <ReceiptFooter />

          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="font-semibold">Sale Completed Successfully</p>

            <p className="text-sm text-gray-600">
              Thank you for shopping with J.Rome Apparel.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <button
            onClick={printReceipt}
            className="mb-3 w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
          >
            Print Receipt
          </button>

          <EmailReceiptButton />

          <button
            onClick={closeReceipt}
            className="w-full rounded-lg bg-black py-3 text-white hover:bg-gray-900 mt-3"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDrawer;

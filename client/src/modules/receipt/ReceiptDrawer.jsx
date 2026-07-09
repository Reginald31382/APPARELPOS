import ResponsiveDrawer from "../../components/layout/ResponsiveDrawer";

import useReceiptStore from "../../store/receipt/useReceiptStore";
import usePanelStore from "../../store/ui/usePanelStore";

import ReceiptHeader from "./ReceiptHeader";
import ReceiptItems from "./ReceiptItems";
import ReceiptTotals from "./ReceiptTotals";
import ReceiptFooter from "./ReceiptFooter";

const ReceiptDrawer = () => {
  const receipt = useReceiptStore((state) => state.receipt);

  const isOpen = useReceiptStore((state) => state.isOpen);

  const closeReceipt = useReceiptStore((state) => state.closeReceipt);

  const showCart = usePanelStore((state) => state.showCart);

  if (!receipt) return null;

  return (
    <ResponsiveDrawer open={isOpen} onClose={closeReceipt} width="500px">
      <div className="flex h-full flex-col bg-white">
        {/* Header */}
        <div className="relative border-b p-5">
          <h2 className="text-2xl font-bold">Receipt</h2>

          <button
            onClick={() => {
              showCart();
              closeReceipt();
            }}
            className="absolute right-5 top-5 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
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
            onClick={closeReceipt}
            className="w-full rounded-lg bg-black py-3 text-white transition hover:bg-gray-900"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </ResponsiveDrawer>
  );
};

export default ReceiptDrawer;

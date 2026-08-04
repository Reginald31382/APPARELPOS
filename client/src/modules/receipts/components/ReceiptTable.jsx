import useReceipts from "../hooks/useReceipts";
import useReceiptDrawerStore from "../store/useReceiptDrawerStore";
import PaymentMethodBadge from "./PaymentMethodBadge";

import { formatCurrency } from "../../../utils/currency";

const ReceiptTable = ({ search, filter }) => {
  const { data: receipts = [], isLoading } = useReceipts();
  const filteredReceipts = receipts.filter((receipt) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      receipt.receiptNumber?.toLowerCase().includes(searchText) ||
      receipt.order?.orderNumber?.toLowerCase().includes(searchText) ||
      receipt.customerEmail?.toLowerCase().includes(searchText);

    let matchesFilter = true;

    if (filter === "POS" || filter === "Online") {
      matchesFilter = receipt.orderType === filter;
    }

    if (filter === "Cash" || filter === "Card" || filter === "Stripe") {
      matchesFilter = receipt.paymentMethod === filter;
    }

    return matchesSearch && matchesFilter;
  });

  const openReceipt = useReceiptDrawerStore((state) => state.openReceipt);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        Loading receipts...
      </div>
    );
  }

  if (receipts.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
        No receipts found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr className="text-left">
            <th className="p-4">Receipt</th>

            <th className="p-4">Order</th>

            <th className="p-4">Customer</th>

            <th className="p-4">Type</th>

            <th className="p-4">Payment</th>

            <th className="p-4 text-right">Total</th>

            <th className="p-4">Date</th>
          </tr>
        </thead>

        <tbody>
          {filteredReceipts.map((receipt) => (
            <tr
              key={receipt._id}
              onClick={() => openReceipt(receipt)}
              className="cursor-pointer border-t transition hover:bg-gray-50"
            >
              <td className="p-4 font-semibold">{receipt.receiptNumber}</td>

              <td className="p-4">{receipt.order?.orderNumber}</td>

              <td className="p-4">{receipt.customerEmail || "Walk-In"}</td>

              <td className="p-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    receipt.orderType === "POS"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {receipt.orderType}
                </span>
              </td>

              <td className="p-4">
                <PaymentMethodBadge method={receipt.paymentMethod} />
              </td>
              <td className="p-4 text-right font-semibold">
                {formatCurrency(receipt.total)}
              </td>

              <td className="p-4">
                {new Date(receipt.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReceiptTable;

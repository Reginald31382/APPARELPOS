import useReceipts from "../hooks/useReceipts";
import useReceiptDrawerStore from "../store/useReceiptDrawerStore";
import PaymentMethodBadge from "./PaymentMethodBadge";
import { formatCurrency } from "../../../utils/currency";

const ReceiptTable = ({ search = "", filter = "All" }) => {
  const { data: receipts = [], isLoading } = useReceipts();
  const openReceipt = useReceiptDrawerStore((state) => state.openReceipt);

  const searchText = search.toLowerCase().trim();

  const filteredReceipts = receipts.filter((receipt) => {
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

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "—";

  const getTypeStyles = (type) =>
    type === "POS"
      ? "bg-blue-100 text-blue-700"
      : "bg-green-100 text-green-700";

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-500">
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

  if (filteredReceipts.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
        No receipts match your search or selected filter.
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* Mobile Receipt Cards */}
      <div className="divide-y divide-gray-100 md:hidden">
        {filteredReceipts.map((receipt) => (
          <button
            key={receipt._id}
            type="button"
            onClick={() => openReceipt(receipt)}
            className="block w-full p-4 text-left transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">
                  {receipt.receiptNumber}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Order: {receipt.order?.orderNumber || "—"}
                </p>
              </div>

              <p className="shrink-0 text-sm font-bold text-gray-900">
                {formatCurrency(receipt.total)}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm text-gray-700">
                  {receipt.customerEmail || "Walk-In"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {formatDate(receipt.createdAt)}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getTypeStyles(
                    receipt.orderType,
                  )}`}
                >
                  {receipt.orderType}
                </span>

                <PaymentMethodBadge method={receipt.paymentMethod} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Desktop Receipt Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[850px] text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr className="text-left">
              <th className="whitespace-nowrap p-4">Receipt</th>
              <th className="whitespace-nowrap p-4">Order</th>
              <th className="whitespace-nowrap p-4">Customer</th>
              <th className="whitespace-nowrap p-4">Type</th>
              <th className="whitespace-nowrap p-4">Payment</th>
              <th className="whitespace-nowrap p-4 text-right">Total</th>
              <th className="whitespace-nowrap p-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredReceipts.map((receipt) => (
              <tr
                key={receipt._id}
                tabIndex={0}
                role="button"
                aria-label={`Open receipt ${receipt.receiptNumber}`}
                onClick={() => openReceipt(receipt)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openReceipt(receipt);
                  }
                }}
                className="cursor-pointer border-t transition hover:bg-gray-50 focus:bg-blue-50 focus:outline-none"
              >
                <td className="whitespace-nowrap p-4 font-semibold">
                  {receipt.receiptNumber}
                </td>

                <td className="whitespace-nowrap p-4">
                  {receipt.order?.orderNumber || "—"}
                </td>

                <td className="max-w-[220px] truncate p-4">
                  {receipt.customerEmail || "Walk-In"}
                </td>

                <td className="whitespace-nowrap p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getTypeStyles(
                      receipt.orderType,
                    )}`}
                  >
                    {receipt.orderType}
                  </span>
                </td>

                <td className="whitespace-nowrap p-4">
                  <PaymentMethodBadge method={receipt.paymentMethod} />
                </td>

                <td className="whitespace-nowrap p-4 text-right font-semibold">
                  {formatCurrency(receipt.total)}
                </td>

                <td className="whitespace-nowrap p-4">
                  {formatDate(receipt.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceiptTable;

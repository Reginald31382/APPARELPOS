import useReceipts from "./hooks/useReceipts";
import { formatCurrency } from "../../utils/currency";

const ReceiptCenter = () => {
  const { data: receipts = [], isLoading } = useReceipts();

  if (isLoading) {
    return <p>Loading receipts...</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Receipts</h1>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Receipt</th>
              <th className="p-4 text-left">Order</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Payment</th>
              <th className="p-4 text-right">Total</th>
            </tr>
          </thead>

          <tbody>
            {receipts.map((receipt) => (
              <tr
                key={receipt._id}
                className="cursor-pointer border-t hover:bg-gray-50"
              >
                <td className="p-4">{receipt.receiptNumber}</td>

                <td className="p-4">{receipt.order?.orderNumber}</td>

                <td className="p-4">{receipt.customerEmail || "Walk-in"}</td>

                <td className="p-4">{receipt.paymentMethod}</td>

                <td className="p-4 text-right font-semibold">
                  {formatCurrency(receipt.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceiptCenter;

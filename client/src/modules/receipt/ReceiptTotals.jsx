import { formatCurrency } from "../../utils/currency";

const ReceiptTotals = ({ subtotal, tax, total }) => {
  return (
    <div className="space-y-2 border-t pt-4">
      <div className="flex justify-between">
        <span>Subtotal</span>

        <span>{formatCurrency(subtotal)}</span>
      </div>

      <div className="flex justify-between">
        <span>Tax</span>

        <span>{formatCurrency(tax)}</span>
      </div>

      <div className="flex justify-between text-xl font-bold">
        <span>Total</span>

        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

export default ReceiptTotals;

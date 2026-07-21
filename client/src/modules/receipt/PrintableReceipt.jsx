import { forwardRef } from "react";
import ReceiptQRCode from "./ReceiptQRCode";
import { formatCurrency } from "../../../utils/currency";

const PrintableReceipt = forwardRef(({ receipt }, ref) => {
  if (!receipt) return null;

  return (
    <div
      ref={ref}
      className="mx-auto w-[340px] rounded-lg bg-white p-6 text-sm text-black"
    >
      <div className="text-center">
        <h1 className="text-xl font-bold">J.Rome Apparel</h1>

        <p>Detroit, Michigan</p>

        <p>(313) 555-1234</p>

        <hr className="my-3" />
      </div>

      <div className="space-y-1">
        <p>Receipt #: {receipt._id?.slice(-8) || "N/A"}</p>

        <p>Date: {new Date().toLocaleString()}</p>

        <p>
          Customer:
          {receipt.customer?.firstName
            ? `${receipt.customer.firstName} ${receipt.customer.lastName}`
            : "Walk-in Customer"}
        </p>

        <hr className="my-3" />
      </div>

      {receipt.items.map((item) => (
        <div key={item.sku} className="mb-3 flex justify-between">
          <div>
            <p>{item.name}</p>

            <p className="text-xs text-gray-500">
              {item.quantity} × {formatCurrency(item.unitPrice)}
            </p>
          </div>

          <p>{formatCurrency(item.quantity * item.unitPrice)}</p>
        </div>
      ))}

      <hr className="my-3" />

      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>

          <span>{formatCurrency(receipt.subtotal)}</span>
        </div>

        {receipt.discount?.amount > 0 && (
          <>
            <div className="flex justify-between">
              <span>Discount</span>

              <span>-{formatCurrency(receipt.discount.amount)}</span>
            </div>

            {receipt.discount.reason && (
              <div className="text-xs italic text-gray-500">
                {receipt.discount.reason}
              </div>
            )}
          </>
        )}

        <div className="flex justify-between">
          <span>Tax</span>

          <span>{formatCurrency(receipt.tax)}</span>
        </div>

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>

          <span>{formatCurrency(receipt.total)}</span>
        </div>
      </div>

      <hr className="my-3" />

      <div className="text-center">
        <p>Paid with {receipt.paymentMethod}</p>

        <p className="mt-4 font-semibold">Thank you for shopping!</p>
      </div>
      <ReceiptQRCode value="https://www.jrome-studios.com" />
    </div>
  );
});

export default PrintableReceipt;

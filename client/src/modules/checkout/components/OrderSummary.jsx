import useCartStore from "../../../store/cart/useCartStore";

import { formatCurrency } from "../../../utils/currency";

const OrderSummary = () => {
  const subtotal = useCartStore((state) => state.subtotal());
  const tax = useCartStore((state) => state.tax());
  const total = useCartStore((state) => state.total());
  const discountAmount = useCartStore((state) => state.discountAmount());
  const discountInfo = useCartStore((state) => state.discount);

  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>

          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>

          <span>{formatCurrency(tax)}</span>
        </div>

        {/* Future Discounts */}

        {discountAmount > 0 && (
          <>
            <div className="flex justify-between text-green-700">
              <span>Discount</span>

              <span>-{formatCurrency(discountAmount)}</span>
            </div>

            {discountInfo.reason && (
              <div className="pl-2 text-sm italic text-gray-500">
                {discountInfo.reason}
              </div>
            )}
          </>
        )}

        <hr />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>

          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

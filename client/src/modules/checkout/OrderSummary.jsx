import useCartStore from "../../store/useCartStore";

const OrderSummary = () => {
  const subtotal = useCartStore((state) => state.subtotal());
  const tax = useCartStore((state) => state.tax());
  const total = useCartStore((state) => state.total());

  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>

          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>

          <span>${tax.toFixed(2)}</span>
        </div>

        {/* Future Discounts */}

        <div className="flex justify-between text-gray-500">
          <span>Discount</span>

          <span>$0.00</span>
        </div>

        <hr />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>

          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

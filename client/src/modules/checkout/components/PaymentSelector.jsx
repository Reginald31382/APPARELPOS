import useCheckoutStore from "../../../store/checkout/useCheckoutStore";
import useCartStore from "../../../store/cart/useCartStore";

const PaymentSelector = () => {
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);
  const setPaymentMethod = useCheckoutStore((state) => state.setPaymentMethod);

  const cashReceived = useCheckoutStore((state) => state.cashReceived);
  const setCashReceived = useCheckoutStore((state) => state.setCashReceived);

  const total = useCartStore((state) => state.total());

  const changeDue = Math.max(0, Number(cashReceived || 0) - total);

  return (
    <div className="rounded-lg border p-5">
      <h3 className="mb-4 text-lg font-semibold">Payment Method</h3>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setPaymentMethod("Cash")}
          className={`rounded-lg border p-3 font-medium transition ${
            paymentMethod === "Cash"
              ? "border-green-600 bg-green-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          💵 Cash
        </button>

        <button
          onClick={() => setPaymentMethod("Stripe")}
          className={`rounded-lg border p-3 font-medium transition ${
            paymentMethod === "Stripe"
              ? "border-blue-600 bg-blue-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          💳 Card
        </button>
      </div>

      {paymentMethod === "Cash" && (
        <div className="mt-6 rounded-lg border bg-gray-50 p-4">
          <label className="mb-2 block text-sm font-semibold">
            Cash Received
          </label>

          <input
            type="number"
            step="0.01"
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
            className="w-full rounded-lg border p-3 text-xl"
            placeholder="0.00"
          />

          <div className="mt-5 flex items-center justify-between text-xl font-bold">
            <span>Change Due</span>

            <span className="text-green-600">${changeDue.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSelector;

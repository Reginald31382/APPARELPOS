import useCheckoutStore from "../../../store/checkout/useCheckoutStore";
import { PAYMENT_METHODS } from "../../../constants/paymentMethods";

const PaymentSelector = () => {
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);

  const setPaymentMethod = useCheckoutStore((state) => state.setPaymentMethod);

  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-4 text-lg font-semibold">Payment Method</h3>

      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.value}
            onClick={() => setPaymentMethod(method.value)}
            className={`rounded border px-4 py-2 ${
              paymentMethod === method.value ? "bg-black text-white" : ""
            }`}
          >
            {method.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentSelector;

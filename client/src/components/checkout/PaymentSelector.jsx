import useCheckoutStore from "../../store/useCheckoutStore";

const paymentMethods = [
  {
    id: "Cash",
    icon: "💵",
    title: "Cash",
    description: "Accept cash payment",
  },
  {
    id: "Card",
    icon: "💳",
    title: "Credit / Debit",
    description: "Card terminal",
  },
  {
    id: "Stripe",
    icon: "🟣",
    title: "Stripe",
    description: "Online payment",
  },
];

const PaymentSelector = () => {
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);

  const setPaymentMethod = useCheckoutStore((state) => state.setPaymentMethod);

  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-4 text-lg font-semibold">Payment Method</h3>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setPaymentMethod(method.id)}
            className={`w-full rounded-lg border p-4 text-left transition
              ${
                paymentMethod === method.id
                  ? "border-green-600 bg-green-50"
                  : "hover:bg-gray-50"
              }
            `}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{method.icon}</span>

              <div>
                <h4 className="font-semibold">{method.title}</h4>

                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentSelector;

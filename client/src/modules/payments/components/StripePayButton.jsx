import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";

const StripePayButton = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    setLoading(false);

    if (result.error) {
      console.error(result.error);

      onError?.(result.error.message);

      return;
    }

    onSuccess?.(result.paymentIntent);
  };

  return (
    <button
      disabled={!stripe || loading}
      onClick={handlePayment}
      className="mt-6 w-full rounded-lg bg-indigo-600 py-4 text-lg font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
    >
      {loading ? "Processing..." : `Pay $${(amount ?? 0).toFixed(2)}`}
    </button>
  );
};

export default StripePayButton;

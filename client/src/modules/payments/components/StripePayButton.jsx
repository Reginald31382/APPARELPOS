import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";

const StripePayButton = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      // console.log("Stripe not ready");
      return;
    }

    // console.log("Starting payment...");

    setLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    // console.log("Stripe Result:", result);

    setLoading(false);

    if (result.error) {
      console.error(result.error);

      onError?.(result.error.message);

      return;
    }

    // console.log("Payment Intent:", result.paymentIntent);

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

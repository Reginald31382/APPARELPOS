import { useEffect, useState } from "react";
import useCheckoutStore from "../../../store/checkout/useCheckoutStore";

import useCreatePaymentIntent from "../hooks/useCreatePaymentIntent";

import StripeLoading from "./StripeLoading";

const StripeModal = ({ total }) => {
  const paymentIntent = useCreatePaymentIntent();

  const clientSecret = useCheckoutStore((state) => state.clientSecret);

  const setClientSecret = useCheckoutStore((state) => state.setClientSecret);

  useEffect(() => {
    if (!total) return;

    if (clientSecret) return;

    paymentIntent.mutate(Math.round(total * 100), {
      onSuccess: (data) => {
        setClientSecret(data.clientSecret);
      },
    });
  }, [total, clientSecret]);

  if (paymentIntent.isPending) {
    return <StripeLoading />;
  }

  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="text-xl font-bold">Stripe Payment</h2>

      <p className="mt-3 text-sm text-gray-600">Client Secret:</p>

      <code className="block mt-2 break-all rounded bg-gray-100 p-3 text-xs">
        {clientSecret}
      </code>
    </div>
  );
};

export default StripeModal;

import { useEffect, useState } from "react";
import useCheckoutStore from "../../../store/checkout/useCheckoutStore";

import useCreatePaymentIntent from "../hooks/useCreatePaymentIntent";

import StripeElementsWrapper from "./StripeElementsWrapper";
import StripePaymentElement from "./StripePaymentElement";

import StripeLoading from "./StripeLoading";

const StripeModal = ({ total }) => {
  const paymentIntent = useCreatePaymentIntent();

  const clientSecret = useCheckoutStore((state) => state.clientSecret);

  const setClientSecret = useCheckoutStore((state) => state.setClientSecret);

  useEffect(() => {
    if (!total) return;
    /11/;
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
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
      <h3 className="text-lg font-semibold">Secure Card Payment</h3>

      <p className="mt-2 text-sm text-gray-600">
        Preparing Stripe's secure payment form...
      </p>
    </div>
  );
};

export default StripeModal;

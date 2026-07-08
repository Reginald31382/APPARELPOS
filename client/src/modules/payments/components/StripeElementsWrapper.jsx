import { Elements } from "@stripe/react-stripe-js";

import stripePromise from "../lib/stripe";

const StripeElementsWrapper = ({ clientSecret, children }) => {
  if (!clientSecret) return null;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      {children}
    </Elements>
  );
};

export default StripeElementsWrapper;

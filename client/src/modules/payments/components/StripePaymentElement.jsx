import { PaymentElement } from "@stripe/react-stripe-js";

const StripePaymentElement = () => {
  return (
    <div className="rounded-lg border bg-white p-5">
      <PaymentElement />
    </div>
  );
};

export default StripePaymentElement;

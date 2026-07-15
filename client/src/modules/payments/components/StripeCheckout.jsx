import { useEffect } from "react";

import useCheckoutStore from "../../../store/checkout/useCheckoutStore";
import useCartStore from "../../../store/cart/useCartStore";
import useCustomerStore from "../../../store/customer/useCustomerStore";
import useReceiptStore from "../../../store/receipt/useReceiptStore";

import useCheckout from "../../../hooks/useCheckout";

import { notifySuccess, notifyError } from "../../../utils/notifications";

import { buildCheckoutOrder } from "../../../services/checkoutWorkflow";
import { completeStripeSale } from "../../checkout/services/completeSale";

import useCreatePaymentIntent from "../hooks/useCreatePaymentIntent";

import StripeElementsWrapper from "./StripeElementsWrapper";
import StripeLoading from "./StripeLoading";
import StripePaymentElement from "./StripePaymentElement";
import StripePayButton from "./StripePayButton";

const StripeCheckout = ({ total }) => {
  const { mutate, isPending } = useCreatePaymentIntent();

  const clientSecret = useCheckoutStore((state) => state.clientSecret);
  const setClientSecret = useCheckoutStore((state) => state.setClientSecret);
  const clearClientSecret = useCheckoutStore(
    (state) => state.clearClientSecret,
  );
  const closeCheckout = useCheckoutStore((state) => state.closeCheckout);

  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const discountInfo = useCartStore((state) => state.discount);

  const discountAmount = useCartStore((state) => state.discountAmount);

  const clearDiscount = useCartStore((state) => state.clearDiscount);
  const tax = useCartStore((state) => state.tax());
  const clearCart = useCartStore((state) => state.clearCart);

  const customer = useCustomerStore((state) => state.selectedCustomer);
  const clearCustomer = useCustomerStore((state) => state.clearCustomer);

  const openReceipt = useReceiptStore((state) => state.openReceipt);

  const checkout = useCheckout();

  useEffect(() => {
    if (!total || clientSecret) return;

    mutate(Math.round(total * 100), {
      onSuccess: ({ clientSecret }) => {
        setClientSecret(clientSecret);
      },
      onError: () => {
        notifyError("Unable to initialize Stripe.");
      },
    });
  }, [total, clientSecret, mutate, setClientSecret]);

  if (isPending) {
    return <StripeLoading />;
  }

  if (!clientSecret) {
    return null;
  }

  const handlePaymentSuccess = async () => {
    console.log("Stripe payment succeeded. Saving order...");
    const order = buildCheckoutOrder({
      items,
      customer,
      subtotal,
      discount: discountAmount(),
      discountType: discountInfo.type,
      discountReason: discountInfo.reason,
      tax,
      total,
      paymentMethod: "Stripe",
    });

    await completeStripeSale({
      order,
      checkout,
      openReceipt,
      clearCart,
      clearDiscount,
      clearCustomer,
      clearClientSecret,
      closeCheckout,
      notifySuccess,
    });
  };

  return (
    <StripeElementsWrapper clientSecret={clientSecret}>
      <div className="space-y-6">
        <StripePaymentElement />

        <>
          <StripePayButton
            amount={total}
            onSuccess={handlePaymentSuccess}
            onError={notifyError}
          />
        </>
      </div>
    </StripeElementsWrapper>
  );
};

export default StripeCheckout;

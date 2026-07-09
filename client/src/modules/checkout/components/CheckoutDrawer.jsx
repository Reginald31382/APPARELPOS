import ResponsiveDrawer from "../../../components/layout/ResponsiveDrawer";

import useCheckoutStore from "../../../store/checkout/useCheckoutStore";
import useCartStore from "../../../store/cart/useCartStore";

import CustomerSummary from "./CustomerSummary";
import CartReview from "./CartReview";
import OrderSummary from "./OrderSummary";
import PaymentSelector from "./PaymentSelector";
import CompleteSaleButton from "./CompleteSaleButton";
import CancelTransactionButton from "./CancelTransactionButton";
import VoidSaleButton from "./VoidSaleButton";

import StripeModal from "../../payments/components/StripeModal";

const CheckoutDrawer = () => {
  const isCheckoutOpen = useCheckoutStore((state) => state.isCheckoutOpen);

  const closeCheckout = useCheckoutStore((state) => state.closeCheckout);

  const clearClientSecret = useCheckoutStore(
    (state) => state.clearClientSecret,
  );

  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);

  const total = useCartStore((state) => state.total());

  const handleCancelTransaction = () => {
    clearClientSecret();
    closeCheckout();
  };

  return (
    <ResponsiveDrawer
      open={isCheckoutOpen}
      onClose={handleCancelTransaction}
      width="500px"
    >
      <div className="flex h-full flex-col bg-white">
        <div className="relative border-b p-5">
          <h2 className="text-2xl font-bold">Checkout</h2>

          <button
            onClick={handleCancelTransaction}
            className="absolute right-5 top-5 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <CustomerSummary />

            <CartReview />

            <OrderSummary />

            <PaymentSelector />

            {paymentMethod === "Stripe" && <StripeModal total={total} />}
          </div>
        </div>

        <div className="border-t bg-white p-6">
          {paymentMethod === "Cash" && <CompleteSaleButton />}

          <CancelTransactionButton />

          <VoidSaleButton />
        </div>
      </div>
    </ResponsiveDrawer>
  );
};

export default CheckoutDrawer;

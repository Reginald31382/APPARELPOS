import useCheckoutStore from "../../../store/checkout/useCheckoutStore";
import useCartStore from "../../../store/cart/useCartStore";

// import CustomerSummary from "./CustomerSummary";
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

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute right-0 top-0 flex h-full w-[500px] flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-2xl font-bold">Checkout</h2>

          <button onClick={handleCancelTransaction} className="text-2xl">
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* <CustomerSummary /> */}

            <CartReview />

            <OrderSummary />

            <PaymentSelector />

            {paymentMethod === "Stripe" && <StripeModal total={total} />}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-white p-6">
          {paymentMethod === "Cash" && <CompleteSaleButton />}

          <CancelTransactionButton />

          <VoidSaleButton />
        </div>
      </div>
    </div>
  );
};

export default CheckoutDrawer;

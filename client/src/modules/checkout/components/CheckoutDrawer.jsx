import useCheckoutStore from "../../../store/checkout/useCheckoutStore";
import useCartStore from "../../../store/cart/useCartStore";
import CustomerSummary from "../components/CustomerSummary";
import CartReview from "../components/CartReview";
import OrderSummary from "../components/OrderSummary";
import PaymentSelector from "../components/PaymentSelector";
import CompleteSaleButton from "../components/CompleteSaleButton";
import CancelTransactionButton from "./CancelTransactionButton";
import VoidSaleButton from "./VoidSaleButton";

import StripeModal from "../../payments/components/StripeModal";

const CheckoutDrawer = () => {
  const isCheckoutOpen = useCheckoutStore((state) => state.isCheckoutOpen);

  const closeCheckout = useCheckoutStore((state) => state.closeCheckout);

  const total = useCartStore((state) => state.total());

  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);

  const clearClientSecret = useCheckoutStore(
    (state) => state.clearClientSecret,
  );

  const handleCancelTransaction = () => {
    clearClientSecret();
    closeCheckout();
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute right-0 top-0 flex h-full w-[500px] flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-2xl font-bold">Checkout</h2>

          <button onClick={handleCancelTransaction} className="text-2xl">
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
    </div>
  );
};

export default CheckoutDrawer;

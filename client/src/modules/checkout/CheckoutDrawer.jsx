import useCheckoutStore from "../../store/checkout/useCheckoutStore";
import CustomerSummary from "./CustomerSummary";
import CartReview from "./CartReview";
import OrderSummary from "./OrderSummary";
import PaymentSelector from "./PaymentSelector";
import CompleteSaleButton from "./CompleteSaleButton";

const CheckoutDrawer = () => {
  const isCheckoutOpen = useCheckoutStore((state) => state.isCheckoutOpen);

  const closeCheckout = useCheckoutStore((state) => state.closeCheckout);

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute right-0 top-0 flex h-full w-[500px] flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-2xl font-bold">Checkout</h2>

          <button onClick={closeCheckout} className="text-2xl">
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <CustomerSummary />

            <CartReview />

            <OrderSummary />

            <PaymentSelector />
          </div>
        </div>
        <div className="border-t bg-white p-6">
          <CompleteSaleButton />
        </div>
      </div>
    </div>
  );
};

export default CheckoutDrawer;

import useCheckoutStore from "../../../store/checkout/useCheckoutStore";
import usePanelStore from "../../../store/ui/usePanelStore";

const CheckoutButton = () => {
  const openCheckout = useCheckoutStore((state) => state.openCheckout);
  const showCheckout = usePanelStore((state) => state.showCheckout);

  return (
    <button
      onClick={() => {
        openCheckout();
        showCheckout();
      }}
      className="w-full rounded-lg bg-green-600 py-3 text-white font-semibold hover:bg-green-700 transition"
    >
      Checkout
    </button>
  );
};

export default CheckoutButton;

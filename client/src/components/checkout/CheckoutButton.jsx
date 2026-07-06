import useCheckoutStore from "../../store/useCheckoutStore";

const CheckoutButton = () => {
  const openCheckout = useCheckoutStore((state) => state.openCheckout);

  return (
    <button
      onClick={openCheckout}
      className="w-full rounded-lg bg-green-600 py-3 text-white font-semibold hover:bg-green-700 transition"
    >
      Checkout
    </button>
  );
};

export default CheckoutButton;

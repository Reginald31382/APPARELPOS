import useCartStore from "../../../store/cart/useCartStore";
import useCheckoutStore from "../../../store/checkout/useCheckoutStore";
import useCustomerStore from "../../../store/customer/useCustomerStore";

import { notifySuccess } from "../../../utils/notifications";

const VoidSaleButton = () => {
  const clearCart = useCartStore((state) => state.clearCart);

  const clearCustomer = useCustomerStore((state) => state.clearCustomer);

  const clearClientSecret = useCheckoutStore(
    (state) => state.clearClientSecret,
  );

  const closeCheckout = useCheckoutStore((state) => state.closeCheckout);

  const handleVoidSale = () => {
    clearCart();
    clearCustomer();
    clearClientSecret();
    closeCheckout();

    notifySuccess("Sale voided");
  };

  return (
    <button
      onClick={handleVoidSale}
      className="mt-3 w-full rounded-lg border border-gray-300 bg-gray-100 py-4 text-lg font-semibold transition hover:bg-gray-200"
    >
      Void Sale
    </button>
  );
};

export default VoidSaleButton;

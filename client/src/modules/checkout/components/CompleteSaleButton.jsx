import useCheckoutStore from "../../../store/checkout/useCheckoutStore";
import useCartStore from "../../../store/cart/useCartStore";
import useCustomerStore from "../../../store/customer/useCustomerStore";
import useReceiptStore from "../../../store/receipt/useReceiptStore";
import useCheckout from "../../../hooks/useCheckout";

import { notifySuccess } from "../../../utils/notifications";
import { buildCheckoutOrder } from "../../../services/checkoutWorkflow";
import { completeCashSale } from "../services/completeSale";

import { notifyError } from "../../../utils/notifications";

const CompleteSaleButton = () => {
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);

  const closeCheckout = useCheckoutStore((state) => state.closeCheckout);

  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const tax = useCartStore((state) => state.tax());
  const total = useCartStore((state) => state.total());
  const clearCart = useCartStore((state) => state.clearCart);

  const customer = useCustomerStore((state) => state.selectedCustomer);

  const clearCustomer = useCustomerStore((state) => state.clearCustomer);

  const clearClientSecret = useCheckoutStore(
    (state) => state.clearClientSecret,
  );

  const checkout = useCheckout();

  const openReceipt = useReceiptStore((state) => state.openReceipt);

  const handleCompleteSale = async () => {
    if (items.length === 0) return;

    const order = buildCheckoutOrder({
      items,
      customer,
      subtotal,
      tax,
      total,
      paymentMethod,
    });

    if (paymentMethod === "Cash") {
      await completeCashSale({
        order,
        checkout,
        openReceipt,
        clearCart,
        clearCustomer,
        clearClientSecret,
        closeCheckout,
        notifySuccess,
        notifyError,
      });

      return;
    }
  };
  // console.log("Checkout pending:", checkout.isPending);

  return (
    <button
      disabled={items.length === 0 || checkout.isPending}
      onClick={handleCompleteSale}
      className="w-full rounded-lg bg-green-600 py-4 text-lg font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {checkout.isPending ? "Processing..." : "Complete Sale"}
    </button>
  );
};

export default CompleteSaleButton;

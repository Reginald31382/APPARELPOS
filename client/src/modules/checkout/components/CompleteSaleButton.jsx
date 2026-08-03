import useCheckoutStore from "../../../store/checkout/useCheckoutStore";
import useCartStore from "../../../store/cart/useCartStore";
import useCustomerStore from "../../../store/customer/useCustomerStore";
import useReceiptStore from "../../../store/receipt/useReceiptStore";
import useCheckout from "../../../hooks/useCheckout";
import useMobileCartStore from "../../../store/ui/useMobileCartStore";

import { notifySuccess, notifyError } from "../../../utils/notifications";
import { buildCheckoutOrder } from "../../../services/checkoutWorkflow";
import { completeCashSale } from "../services/completeSale";

const CompleteSaleButton = () => {
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);

  const closeCheckout = useCheckoutStore((state) => state.closeCheckout);

  const clearClientSecret = useCheckoutStore(
    (state) => state.clearClientSecret,
  );

  const cashReceived = useCheckoutStore((state) => state.cashReceived);

  const clearCashReceived = useCheckoutStore(
    (state) => state.clearCashReceived,
  );

  const items = useCartStore((state) => state.items);

  const subtotal = useCartStore((state) => state.subtotal());

  const tax = useCartStore((state) => state.tax());

  const total = useCartStore((state) => state.total());

  const discountInfo = useCartStore((state) => state.discount);

  const discountAmount = useCartStore((state) => state.discountAmount);

  const clearDiscount = useCartStore((state) => state.clearDiscount);

  const clearCart = useCartStore((state) => state.clearCart);

  const closeCart = useMobileCartStore((state) => state.closeCart);

  const customer = useCustomerStore((state) => state.selectedCustomer);

  const clearCustomer = useCustomerStore((state) => state.clearCustomer);

  const checkout = useCheckout();

  const openReceipt = useReceiptStore((state) => state.openReceipt);

  const handleCompleteSale = async () => {
    if (items.length === 0) return;

    if (paymentMethod === "Cash" && Number(cashReceived || 0) < total) {
      notifyError("Cash received is less than the order total.");
      return;
    }

    const order = buildCheckoutOrder({
      items,
      customer,
      subtotal,
      discount: discountAmount(),
      discountType: discountInfo.type,
      discountReason: discountInfo.reason,
      tax,
      total,
      paymentMethod,
      orderType: "POS",
    });

    if (paymentMethod === "Cash") {
      await completeCashSale({
        order,
        checkout,
        openReceipt,
        clearCart,
        clearDiscount,
        clearCustomer,
        clearClientSecret,
        clearCashReceived,
        closeCheckout,
        closeCart,
        notifySuccess,
        notifyError,
      });

      return;
    }
  };

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

import useCheckoutStore from "../../../store/checkout/useCheckoutStore";

const CancelTransactionButton = () => {
  const closeCheckout = useCheckoutStore((state) => state.closeCheckout);
  const clearClientSecret = useCheckoutStore(
    (state) => state.clearClientSecret,
  );

  const handleCancel = () => {
    clearClientSecret();
    closeCheckout();
  };

  return (
    <button
      onClick={handleCancel}
      className="mt-3 w-full rounded-lg border border-red-300 bg-white py-4 text-lg font-semibold text-red-600 transition hover:bg-red-50"
    >
      Cancel Transaction
    </button>
  );
};

export default CancelTransactionButton;

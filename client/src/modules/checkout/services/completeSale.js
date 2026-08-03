export const completeCashSale = async ({
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
}) => {
  return new Promise((resolve, reject) => {
    checkout.mutate(order, {
      onSuccess: (savedOrder) => {
        openReceipt(savedOrder);

        clearClientSecret();
        clearCashReceived();

        clearCart();
        clearDiscount();
        clearCustomer();

        closeCheckout();
        closeCart();

        notifySuccess("Sale completed");

        resolve(savedOrder);
      },

      onError: reject,
    });
  });
};

export const completeStripeSale = async ({
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
}) => {
  return new Promise((resolve, reject) => {
    checkout.mutate(order, {
      onSuccess: (savedOrder) => {
        openReceipt(savedOrder);

        clearClientSecret();
        clearCashReceived();

        clearCart();
        clearDiscount();
        clearCustomer();

        closeCheckout();
        closeCart();

        notifySuccess("Payment successful");

        resolve(savedOrder);
      },

      onError: reject,
    });
  });
};

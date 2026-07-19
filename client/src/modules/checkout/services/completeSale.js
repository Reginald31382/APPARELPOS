export const completeCashSale = async ({
  order,
  checkout,
  openReceipt,
  clearCart,
  clearDiscount,
  clearCustomer,
  clearClientSecret,
  closeCheckout,
  closeCart,
  notifySuccess,
}) => {
  return new Promise((resolve, reject) => {
    checkout.mutate(order, {
      onSuccess: (savedOrder) => {
        openReceipt(savedOrder);

        clearClientSecret();

        clearCart();

        clearDiscount();

        clearCustomer();

        clearClientSecret();

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
  closeCheckout,
  notifySuccess,
}) => {
  return new Promise((resolve, reject) => {
    checkout.mutate(order, {
      onSuccess: (savedOrder) => {
        openReceipt(savedOrder);

        clearClientSecret();

        clearCart();
        clearDiscount();
        clearCustomer();
        closeCheckout();

        notifySuccess("Payment successful");

        resolve(savedOrder);
      },

      onError: reject,
    });
  });
};

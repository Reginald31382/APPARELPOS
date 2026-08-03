import { create } from "zustand";

const useCheckoutStore = create((set) => ({
  // Drawer state
  isCheckoutOpen: false,

  // Payment method
  paymentMethod: "Stripe",

  // UI state
  isSubmitting: false,

  // Completed order
  completedOrder: null,

  openCheckout: () =>
    set({
      isCheckoutOpen: true,
    }),

  closeCheckout: () =>
    set({
      isCheckoutOpen: false,
    }),

  setPaymentMethod: (paymentMethod) =>
    set({
      paymentMethod,
    }),

  cashReceived: "",

  setCashReceived: (amount) =>
    set({
      cashReceived: amount,
    }),

  clearCashReceived: () =>
    set({
      cashReceived: "",
    }),

  startSubmitting: () =>
    set({
      isSubmitting: true,
    }),

  stopSubmitting: () =>
    set({
      isSubmitting: false,
    }),

  setCompletedOrder: (order) =>
    set({
      completedOrder: order,
    }),

  clearCompletedOrder: () =>
    set({
      completedOrder: null,
    }),

  clientSecret: "",

  setClientSecret: (clientSecret) =>
    set({
      clientSecret,
    }),

  clearClientSecret: () =>
    set({
      clientSecret: "",
    }),
}));

export default useCheckoutStore;

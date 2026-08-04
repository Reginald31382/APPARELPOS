import { create } from "zustand";

const useReceiptDrawerStore = create((set) => ({
  isOpen: false,
  receipt: null,

  openReceipt: (receipt) =>
    set({
      isOpen: true,
      receipt,
    }),

  closeReceipt: () =>
    set({
      isOpen: false,
      receipt: null,
    }),
}));

export default useReceiptDrawerStore;

import { create } from "zustand";

const useReceiptStore = create((set) => ({
  receipt: null,

  isOpen: false,

  openReceipt: (receipt) =>
    set({
      receipt,
      isOpen: true,
    }),

  closeReceipt: () =>
    set({
      receipt: null,
      isOpen: false,
    }),
}));

export default useReceiptStore;

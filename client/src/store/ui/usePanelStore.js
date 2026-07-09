import { create } from "zustand";

const usePanelStore = create((set) => ({
  activePanel: "cart",

  showCart: () => set({ activePanel: "cart" }),

  showCheckout: () => set({ activePanel: "checkout" }),

  showReceipt: () => set({ activePanel: "receipt" }),

  showQuickView: () => set({ activePanel: "quickview" }),
}));

export default usePanelStore;

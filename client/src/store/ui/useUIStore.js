import { create } from "zustand";

const useUIStore = create((set) => ({
  // Drawers
  isCartOpen: false,
  isCheckoutOpen: false,
  isReceiptOpen: false,
  isQuickViewOpen: false,

  // Sidebar
  isSidebarOpen: false,

  // Cart
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () =>
    set((state) => ({
      isCartOpen: !state.isCartOpen,
    })),

  // Checkout
  openCheckout: () => set({ isCheckoutOpen: true }),
  closeCheckout: () => set({ isCheckoutOpen: false }),

  // Receipt
  openReceipt: () => set({ isReceiptOpen: true }),
  closeReceipt: () => set({ isReceiptOpen: false }),

  // Quick View
  openQuickView: () => set({ isQuickViewOpen: true }),
  closeQuickView: () => set({ isQuickViewOpen: false }),

  // Sidebar
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),
}));

export default useUIStore;

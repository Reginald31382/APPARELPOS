import { create } from "zustand";

const useUIStore = create((set) => ({
  isCartOpen: false,

  openCart: () => set({ isCartOpen: true }),

  closeCart: () => set({ isCartOpen: false }),

  toggleCart: () =>
    set((state) => ({
      isCartOpen: !state.isCartOpen,
    })),
}));

export default useUIStore;

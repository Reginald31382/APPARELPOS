import { create } from "zustand";

const useMobileCartStore = create((set) => ({
  isOpen: false,

  openCart: () => set({ isOpen: true }),

  closeCart: () => set({ isOpen: false }),

  toggleCart: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),
}));

export default useMobileCartStore;

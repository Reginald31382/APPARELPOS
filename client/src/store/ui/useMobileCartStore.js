import { create } from "zustand";

const useMobileCartStore = create((set) => ({
  // Mobile Cart
  isOpen: false,

  openCart: () => set({ isOpen: true }),

  closeCart: () => set({ isOpen: false }),

  toggleCart: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),

  // Desktop Cart
  isDesktopCollapsed: false,

  collapseDesktopCart: () =>
    set({
      isDesktopCollapsed: true,
    }),

  expandDesktopCart: () =>
    set({
      isDesktopCollapsed: false,
    }),

  toggleDesktopCart: () =>
    set((state) => ({
      isDesktopCollapsed: !state.isDesktopCollapsed,
    })),
}));

export default useMobileCartStore;

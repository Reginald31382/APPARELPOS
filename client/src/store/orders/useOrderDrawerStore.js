import { create } from "zustand";

const useOrderDrawerStore = create((set) => ({
  order: null,
  isOpen: false,

  openOrder: (order) =>
    set({
      order,
      isOpen: true,
    }),

  closeOrder: () =>
    set({
      order: null,
      isOpen: false,
    }),
}));

export default useOrderDrawerStore;

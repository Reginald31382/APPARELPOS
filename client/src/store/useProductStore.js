import { create } from "zustand";

const useProductStore = create((set) => ({
  selectedProduct: null,
  isOpen: false,

  openProduct: (product) =>
    set({
      selectedProduct: product,
      isOpen: true,
    }),

  closeProduct: () =>
    set({
      selectedProduct: null,
      isOpen: false,
    }),
}));

export default useProductStore;

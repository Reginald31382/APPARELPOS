import { create } from "zustand";

const useNewsletterStore = create((set) => ({
  open: false,

  openModal: () =>
    set({
      open: true,
    }),

  closeModal: () =>
    set({
      open: false,
    }),
}));

export default useNewsletterStore;

import { create } from "zustand";

const useContactStore = create((set) => ({
  isOpen: false,

  openModal: () => set({ isOpen: true }),

  closeModal: () => set({ isOpen: false }),
}));

export default useContactStore;

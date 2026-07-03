import { create } from "zustand";

const useFilterStore = create((set) => ({
  search: "",
  category: "",
  brand: "",
  featured: false,

  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setBrand: (brand) => set({ brand }),
  setFeatured: (featured) => set({ featured }),

  resetFilters: () =>
    set({
      search: "",
      category: "",
      brand: "",
      featured: false,
    }),
}));

export default useFilterStore;

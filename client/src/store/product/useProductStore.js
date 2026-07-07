import { create } from "zustand";

const useProductStore = create((set) => ({
  // Quick View
  selectedProduct: null,
  isOpen: false,

  // Filters
  search: "",
  category: "",
  brand: "",
  featured: false,

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

  setSearch: (search) =>
    set({
      search,
    }),

  setCategory: (category) =>
    set({
      category,
    }),

  setBrand: (brand) =>
    set({
      brand,
    }),

  setFeatured: (featured) =>
    set({
      featured,
    }),

  sort: "newest",
  setSort: (sort) =>
    set({
      sort,
    }),

  clearFilters: () =>
    set({
      search: "",
      category: "",
      brand: "",
      featured: false,
      sort: "newest",
    }),
}));

export default useProductStore;

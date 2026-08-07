import { create } from "zustand";

const useProductStore = create((set) => ({
  // Quick View
  selectedProduct: null,
  isOpen: false,

  // Filters
  search: "",
  category: "",
  gender: "",
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

  setGender: (gender) =>
    set({
      gender,
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
      gender: "",
      brand: "",
      featured: false,
      sort: "newest",
    }),
}));

export default useProductStore;

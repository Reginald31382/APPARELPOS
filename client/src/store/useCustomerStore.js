import { create } from "zustand";

const useCustomerStore = create((set) => ({
  // Selected customer
  selectedCustomer: null,

  // Search text
  search: "",

  // Drawer state
  isCustomerDrawerOpen: false,

  // Actions
  setSearch: (search) =>
    set({
      search,
    }),

  selectCustomer: (customer) =>
    set({
      selectedCustomer: customer,
      isCustomerDrawerOpen: false,
    }),

  clearCustomer: () =>
    set({
      selectedCustomer: null,
    }),

  openCustomerDrawer: () =>
    set({
      isCustomerDrawerOpen: true,
    }),

  closeCustomerDrawer: () =>
    set({
      isCustomerDrawerOpen: false,
    }),
}));

export default useCustomerStore;

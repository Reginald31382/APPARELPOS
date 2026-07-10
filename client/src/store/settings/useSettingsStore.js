import { create } from "zustand";

const useSettingsStore = create((set) => ({
  businessName: "J.Rome Apparel",
  phone: "",
  email: "",
  website: "",
  address: "",
  taxRate: 0.06,
  receiptFooter: "Thank you for shopping with us!",
  autoPrintReceipts: false,
  defaultPaymentMethod: "Cash",

  updateSettings: (settings) =>
    set((state) => ({
      ...state,
      ...settings,
    })),
}));

export default useSettingsStore;

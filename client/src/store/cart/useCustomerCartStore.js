import { create } from "zustand";
import { persist } from "zustand/middleware";

import { notifyError } from "../../utils/notifications";

const TAX_RATE = 0.06;

const useCustomerCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      discount: {
        type: null,
        value: 0,
        reason: "",
      },

      addItem: (item) => {
        const items = [...get().items];

        const existingIndex = items.findIndex((i) => i.sku === item.sku);

        const quantityToAdd = item.quantity ?? 1;

        if (existingIndex !== -1) {
          const newQuantity = items[existingIndex].quantity + quantityToAdd;

          if (newQuantity > item.stock) {
            notifyError("Not enough inventory");
            return;
          }

          items[existingIndex].quantity = newQuantity;

          set({ items });

          return;
        }

        items.push({
          ...item,
          quantity: quantityToAdd,
        });

        set({ items });
      },

      removeItem: (sku) => {
        set({
          items: get().items.filter((item) => item.sku !== sku),
        });
      },

      increaseQuantity: (sku) => {
        const items = [...get().items];

        const item = items.find((i) => i.sku === sku);

        if (!item) return;

        if (item.quantity >= item.stock) {
          notifyError("Not enough inventory");
          return;
        }

        item.quantity++;

        set({ items });
      },

      decreaseQuantity: (sku) => {
        const items = [...get().items];

        const item = items.find((i) => i.sku === sku);

        if (!item) return;

        if (item.quantity === 1) {
          set({
            items: items.filter((i) => i.sku !== sku),
          });

          return;
        }

        item.quantity--;

        set({ items });
      },

      updateQuantity: (sku, quantity) => {
        const items = [...get().items];

        const item = items.find((i) => i.sku === sku);

        if (!item) return false;

        const newQuantity = Number(quantity);

        if (!Number.isInteger(newQuantity) || newQuantity < 0) {
          return false;
        }

        if (newQuantity === 0) {
          set({
            items: items.filter((i) => i.sku !== sku),
          });

          return true;
        }

        if (newQuantity > item.stock) {
          notifyError("Not enough inventory");
          return false;
        }

        item.quantity = newQuantity;

        set({ items });

        return true;
      },
      setDiscount: (discount) =>
        set({
          discount,
        }),

      clearDiscount: () =>
        set({
          discount: {
            type: null,
            value: 0,
            reason: "",
          },
        }),

      clearCart: () => set({ items: [] }),

      subtotal: () =>
        get().items.reduce(
          (total, item) => total + item.unitPrice * item.quantity,
          0,
        ),

      discountAmount: () => {
        const { type, value } = get().discount;

        const subtotal = get().subtotal();

        if (!type) return 0;

        if (type === "Percentage") {
          return subtotal * (value / 100);
        }

        return value;
      },

      tax: () => {
        const taxable = get().subtotal() - get().discountAmount();

        return taxable * TAX_RATE;
      },

      total: () => get().subtotal() - get().discountAmount() + get().tax(),
    }),
    {
      name: "jrome-customer-cart",
    },
  ),
);

export default useCustomerCartStore;

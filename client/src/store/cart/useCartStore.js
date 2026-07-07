import { create } from "zustand";
import { persist } from "zustand/middleware";

import { notifyError } from "../../utils/notifications";

const TAX_RATE = 0.06;

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = [...get().items];

        const existingIndex = items.findIndex((i) => i.sku === item.sku);

        if (existingIndex !== -1) {
          if (items[existingIndex].quantity >= item.stock) {
            notifyError("Not enough inventory");
            return;
          }

          items[existingIndex].quantity += 1;

          set({ items });

          return;
        }

        items.push({
          ...item,
          quantity: 1,
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

      clearCart: () => set({ items: [] }),

      subtotal: () =>
        get().items.reduce(
          (total, item) => total + item.unitPrice * item.quantity,
          0,
        ),

      tax: () => get().subtotal() * TAX_RATE,

      total: () => get().subtotal() + get().tax(),
    }),
    {
      name: "jrome-pos-cart",
    },
  ),
);

export default useCartStore;

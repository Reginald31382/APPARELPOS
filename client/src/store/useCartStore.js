import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product, variant) => {
        const cart = get().cart;

        const existingItemIndex = cart.findIndex(
          (item) =>
            item.productId === product._id && item.variant.sku === variant.sku,
        );

        if (existingItemIndex !== -1) {
          const updatedCart = [...cart];

          updatedCart[existingItemIndex].quantity += 1;

          set({ cart: updatedCart });
          return;
        }

        set({
          cart: [
            ...cart,
            {
              productId: product._id,
              name: product.name,
              price: product.price,
              image: product.images?.[0],
              variant: {
                color: variant.color,
                size: variant.size,
                sku: variant.sku,
              },
              quantity: 1,
            },
          ],
        });
      },

      removeFromCart: (sku) => {
        set({
          cart: get().cart.filter((item) => item.variant.sku !== sku),
        });
      },

      updateQuantity: (sku, quantity) => {
        const cart = get().cart.map((item) =>
          item.variant.sku === sku ? { ...item, quantity } : item,
        );

        set({ cart });
      },

      clearCart: () => set({ cart: [] }),

      getTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },

      getItemCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "pos-cart",
    },
  ),
);

export default useCartStore;

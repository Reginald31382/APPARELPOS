import CheckoutButton from "../checkout/components/CheckoutButton";

import useCartStore from "../../store/cart/useCartStore";

import { formatCurrency } from "../../utils/currency";

const CartDrawer = () => {
  const items = useCartStore((state) => state.items);

  const increaseQuantity = useCartStore((state) => state.increaseQuantity);

  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const removeItem = useCartStore((state) => state.removeItem);

  const subtotal = useCartStore((state) => state.subtotal);

  const tax = useCartStore((state) => state.tax);

  const total = useCartStore((state) => state.total);

  return (
    <div className="flex h-full flex-col border-l bg-white">
      <div className="border-b p-4">
        <h1 className="text-lg font-bold sm:text-xl">Shopping Cart</h1>

        <p className="text-sm text-gray-500">Current Sale</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-3 sm:p-4">
        {items.length === 0 && (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}

        {items.map((item) => (
          <div key={item.sku} className="rounded-lg border p-3 sm:p-4">
            <img
              src={item.image}
              alt={item.name}
              className="mb-3 h-24 w-full rounded object-cover sm:h-28"
            />

            <h3 className="font-semibold">{item.name}</h3>

            <p className="text-sm text-gray-500">
              {item.color} / {item.size}
            </p>

            <p className="font-bold">{formatCurrency(item.unitPrice)}</p>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => decreaseQuantity(item.sku)}
                className="rounded border px-3 py-1"
              >
                −
              </button>

              <span className="min-w-[24px] text-center">{item.quantity}</span>

              <button
                onClick={() => increaseQuantity(item.sku)}
                className="rounded border px-3 py-1"
              >
                +
              </button>

              <button
                onClick={() => removeItem(item.sku)}
                className="ml-auto text-sm font-medium text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t bg-white p-4">
        <div className="flex justify-between">
          <span>Subtotal</span>

          <span>{formatCurrency(subtotal())}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>

          <span>{formatCurrency(tax())}</span>
        </div>

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>

          <span>{formatCurrency(total())}</span>
        </div>

        <CheckoutButton />
      </div>
    </div>
  );
};

export default CartDrawer;

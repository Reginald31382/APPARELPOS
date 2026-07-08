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
    <div className="flex h-full flex-col border-l">
      <div className="border-b p-4 text-xl font-bold">Shopping Cart</div>
      <div className="border-b p-4">
        <h2 className="text-xl font-bold">Current Sale</h2>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {items.length === 0 && (
          <p className="text-gray-500">Your cart is empty.</p>
        )}

        {items.map((item) => (
          <div key={item.sku} className="rounded-lg border p-4">
            <img
              src={item.image}
              alt={item.name}
              className="mb-3 h-28 w-full rounded object-cover"
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

              <span>{item.quantity}</span>

              <button
                onClick={() => increaseQuantity(item.sku)}
                className="rounded border px-3 py-1"
              >
                +
              </button>

              <button
                onClick={() => removeItem(item.sku)}
                className="ml-auto text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t p-4">
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

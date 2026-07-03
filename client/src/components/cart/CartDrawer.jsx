import useCartStore from "../../store/useCartStore";

const CartDrawer = () => {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotal = useCartStore((state) => state.getTotal);

  return (
    <div className="fixed right-0 top-0 h-full w-96 border-l bg-white shadow-lg">
      <div className="border-b p-4 text-xl font-bold">Cart</div>

      <div className="h-[75vh] overflow-y-auto p-4 space-y-4">
        {cart.length === 0 && <p className="text-gray-500">Cart is empty</p>}

        {cart.map((item) => (
          <div key={item.variant.sku} className="rounded-lg border p-3">
            <h4 className="font-bold">{item.name}</h4>

            <p className="text-sm text-gray-500">
              {item.variant.color} / {item.variant.size}
            </p>

            <p className="text-blue-600 font-bold">${item.price}</p>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() =>
                  updateQuantity(
                    item.variant.sku,
                    Math.max(1, item.quantity - 1),
                  )
                }
                className="px-2 py-1 border"
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() =>
                  updateQuantity(item.variant.sku, item.quantity + 1)
                }
                className="px-2 py-1 border"
              >
                +
              </button>

              <button
                onClick={() => removeFromCart(item.variant.sku)}
                className="ml-auto text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t p-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${getTotal().toFixed(2)}</span>
        </div>

        <button className="mt-4 w-full rounded-lg bg-green-600 py-3 text-white">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartDrawer;

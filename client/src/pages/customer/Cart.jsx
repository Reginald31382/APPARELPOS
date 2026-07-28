import { Link, useNavigate } from "react-router-dom";
import useCustomerCartStore from "../../store/cart/useCustomerCartStore";
import { formatCurrency } from "../../utils/currency";

const Cart = () => {
  const navigate = useNavigate();

  const items = useCustomerCartStore((state) => state.items);
  const subtotal = useCustomerCartStore((state) => state.subtotal);
  const increaseQuantity = useCustomerCartStore(
    (state) => state.increaseQuantity,
  );
  const decreaseQuantity = useCustomerCartStore(
    (state) => state.decreaseQuantity,
  );
  const removeItem = useCustomerCartStore((state) => state.removeItem);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="mb-4 text-4xl font-bold">Your Cart is Empty</h1>

        <p className="mb-8 text-gray-500">
          Looks like you haven't added anything yet.
        </p>

        <Link
          to="/shop"
          className="rounded-xl bg-black px-8 py-4 text-white transition hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-10 text-4xl font-bold">Shopping Cart</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Items */}

        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.sku}
              className="flex gap-5 rounded-2xl border bg-white p-5"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-32 w-28 rounded-xl object-cover"
              />

              <div className="flex flex-1 flex-col">
                <h2 className="text-xl font-semibold">{item.name}</h2>

                <p className="text-gray-500">
                  {item.color} / {item.size}
                </p>

                <p className="mt-2 font-bold">
                  {formatCurrency(item.unitPrice)}
                </p>

                <div className="mt-auto flex items-center gap-3">
                  <button
                    onClick={() => decreaseQuantity(item.sku)}
                    className="h-9 w-9 rounded border"
                  >
                    −
                  </button>

                  <span className="w-8 text-center font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQuantity(item.sku)}
                    className="h-9 w-9 rounded border"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(item.sku)}
                    className="ml-auto text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-lg font-bold">
                {formatCurrency(item.unitPrice * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}

        <aside className="h-fit rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold">Order Summary</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>{formatCurrency(subtotal())}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>

              <span>Calculated at Checkout</span>
            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>

              <span>{formatCurrency(subtotal())}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full rounded-xl bg-black py-4 text-lg font-semibold text-white transition hover:bg-gray-800"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/shop"
              className="block text-center text-gray-600 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;

import useMobileCartStore from "../../store/ui/useMobileCartStore";
import CheckoutButton from "../checkout/components/CheckoutButton";
import DiscountModal from "../checkout/components/DiscountModal";
import { useState } from "react";
import useCartStore from "../../store/cart/useCartStore";

import { formatCurrency } from "../../utils/currency";

const CartDrawer = () => {
  const items = useCartStore((state) => state.items);
  const [discountOpen, setDiscountOpen] = useState(false);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);

  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const removeItem = useCartStore((state) => state.removeItem);

  const subtotal = useCartStore((state) => state.subtotal);

  const tax = useCartStore((state) => state.tax);

  const discount = useCartStore((state) => state.discountAmount);

  const discountInfo = useCartStore((state) => state.discount);

  const clearDiscount = useCartStore((state) => state.clearDiscount);

  const total = useCartStore((state) => state.total);

  const isOpen = useMobileCartStore((state) => state.isOpen);

  const closeCart = useMobileCartStore((state) => state.closeCart);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={closeCart}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <div
        className={`
          fixed right-0 top-0 z-50 flex h-full w-full max-w-md
          flex-col border-l bg-white shadow-2xl
          transition-transform duration-300

          lg:static
          lg:h-full
          lg:w-auto
          lg:max-w-none
          lg:translate-x-0

          ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="relative border-b p-4">
          <h1 className="text-lg font-bold sm:text-xl">Shopping Cart</h1>

          <p className="text-sm text-gray-500">Current Sale</p>

          <button
            onClick={closeCart}
            className="absolute right-4 top-4 text-2xl lg:hidden"
          >
            ×
          </button>
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

                <span className="min-w-[24px] text-center">
                  {item.quantity}
                </span>

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
          {discount() > 0 && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-green-700">
                    Discount Applied
                  </p>

                  <p className="text-sm text-green-600">
                    {discountInfo.reason || "Manual Discount"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-green-700">
                    -{formatCurrency(discount())}
                  </p>

                  <button
                    onClick={clearDiscount}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between">
            <span>Tax</span>

            <span>{formatCurrency(tax())}</span>
          </div>

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>

            <span>{formatCurrency(total())}</span>
          </div>
          <button
            onClick={() => setDiscountOpen(true)}
            className="w-full rounded-lg border border-dashed py-3 font-medium hover:bg-gray-50"
          >
            Apply Discount
          </button>
          <CheckoutButton />
        </div>
      </div>
      <DiscountModal open={discountOpen} onOpenChange={setDiscountOpen} />
    </>
  );
};

export default CartDrawer;

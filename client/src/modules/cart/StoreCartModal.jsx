import { X, Minus, Plus, Trash2 } from "lucide-react";
import useCartStore from "../../store/cart/useCartStore";
import useMobileCartStore from "../../store/ui/useMobileCartStore";
import { formatCurrency } from "../../utils/currency";

const StoreCartModal = () => {
  const isOpen = useMobileCartStore((state) => state.isOpen);
  const closeCart = useMobileCartStore((state) => state.closeCart);

  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.subtotal);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-2xl font-semibold">Shopping Cart</h2>

            <button
              onClick={closeCart}
              className="rounded-full p-2 transition hover:bg-gray-100"
            >
              <X size={22} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="py-20 text-center text-gray-500">
                Your cart is empty.
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.sku} className="flex gap-5 border-b pb-5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-28 w-24 rounded-lg object-cover"
                    />

                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>

                          <p className="text-sm text-gray-500">
                            {item.color} / {item.size}
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.sku)}
                          className="text-red-500 transition hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => decreaseQuantity(item.sku)}
                            className="rounded-full border p-2 hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="w-6 text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(item.sku)}
                            className="rounded-full border p-2 hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="font-semibold">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="space-y-5 border-t p-6">
            <div className="flex justify-between text-lg font-semibold">
              <span>Subtotal</span>

              <span>{formatCurrency(subtotal())}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={closeCart}
                className="rounded-xl border py-3 font-medium transition hover:bg-gray-100"
              >
                Continue Shopping
              </button>

              <button className="rounded-xl bg-black py-3 font-medium text-white transition hover:bg-gray-800">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreCartModal;

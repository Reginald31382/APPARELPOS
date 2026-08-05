import { useEffect } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useCustomerCartStore from "../../store/cart/useCustomerCartStore";
import useMobileCartStore from "../../store/ui/useMobileCartStore";
import { formatCurrency } from "../../utils/currency";

const StoreCartModal = () => {
  const isOpen = useMobileCartStore((state) => state.isOpen);
  const closeCart = useMobileCartStore((state) => state.closeCart);

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

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
      />

      {/* Drawer / Modal */}
      <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
        <div className="flex h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-3xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-5 sm:p-6">
            <h2 className="text-xl font-semibold sm:text-2xl">Shopping Cart</h2>

            <button
              onClick={closeCart}
              className="rounded-full p-2 transition hover:bg-gray-100"
            >
              <X size={22} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {items.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-500">
                Your cart is empty.
              </div>
            ) : (
              <div className="space-y-5">
                {items.map((item) => (
                  <div
                    key={item.sku}
                    className="flex gap-3 border-b pb-4 sm:gap-5 sm:pb-5"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-lg object-cover sm:h-28 sm:w-24"
                    />

                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold sm:text-base">
                            {item.name}
                          </h3>

                          <p className="text-xs text-gray-500 sm:text-sm">
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

                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decreaseQuantity(item.sku)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border transition active:scale-95"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="w-6 text-center font-medium">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(item.sku)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border transition active:scale-95"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <span className="font-semibold">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t bg-white px-5 pt-5 pb-[calc(env(safe-area-inset-bottom)+20px)] shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
            <div className="mb-5 flex items-center justify-between text-lg font-semibold">
              <span>Subtotal</span>

              <span>{formatCurrency(subtotal())}</span>
            </div>

            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
              <button
                onClick={closeCart}
                className="rounded-xl border py-3 font-medium transition hover:bg-gray-100"
              >
                Continue Shopping
              </button>

              <button
                onClick={() => {
                  closeCart();
                  navigate("/checkout");
                }}
                className="rounded-xl bg-black py-3 font-medium text-white transition hover:bg-gray-800"
              >
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

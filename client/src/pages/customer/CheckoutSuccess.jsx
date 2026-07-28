import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import useCustomerCartStore from "../../store/cart/useCustomerCartStore";
import { formatCurrency } from "../../utils/currency";
import { GiGlassCelebration } from "react-icons/gi";

const CheckoutSuccess = () => {
  const clearCart = useCustomerCartStore((state) => state.clearCart);

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearCart();

    const fetchOrder = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/orders/success/${sessionId}`);
        setOrder(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId, clearCart]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20">Loading your order...</div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-2xl border bg-white p-10 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 text-6xl">
            <GiGlassCelebration className="mx-auto h-20 w-20" />
          </div>

          <h1 className="text-4xl font-bold">Thank You For Your Order!</h1>

          <p className="mt-4 text-gray-600">
            Your payment has been successfully processed.
          </p>
        </div>

        {order ? (
          <>
            <div className="mb-8 grid gap-6 rounded-xl bg-gray-50 p-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-bold text-xl">{order.orderNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="font-semibold">{order.paymentStatus}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Order Total</p>
                <p className="font-bold">{formatCurrency(order.total)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{order.customerEmail}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">Shipping Address</h2>

              <div className="rounded-xl border p-5">
                <p className="font-semibold">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </p>

                <p>{order.shippingAddress.address1}</p>

                {order.shippingAddress.address2 && (
                  <p>{order.shippingAddress.address2}</p>
                )}

                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>

                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">Items Purchased</h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.sku}
                    className="flex items-center justify-between rounded-xl border p-4"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>

                      <p className="text-sm text-gray-500">
                        {item.color} / {item.size}
                      </p>

                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>

                    <div className="font-bold">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-xl bg-red-50 p-6 text-center">
            Unable to locate your order.
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-block rounded-xl bg-black px-8 py-4 font-semibold text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;

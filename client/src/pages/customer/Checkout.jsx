import useStore from "../../modules/settings/hooks/useStore";
import api from "../../api/axios";
import { useState } from "react";
import useCustomerCartStore from "../../store/cart/useCustomerCartStore";
import { formatCurrency } from "../../utils/currency";
import { US_STATES } from "../../constants/usStates";

const Checkout = () => {
  const items = useCustomerCartStore((state) => state.items);

  const subtotal = useCustomerCartStore((state) => state.subtotal());
  const { data: store } = useStore();

  const [checkout, setCheckout] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    shippingMethod: null,
  });

  const [shippingRates, setShippingRates] = useState([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(null);

  const taxRate = store?.taxRate ?? 6;

  const tax = subtotal * (taxRate / 100);

  const freeShippingThreshold = store?.freeShippingThreshold ?? 150;

  const shippingCost =
    subtotal >= freeShippingThreshold ? 0 : (selectedShipping?.cost ?? 0);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setCheckout((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchShippingRates = async () => {
    if (!isCheckoutValid) return;

    try {
      setLoadingRates(true);
      setSelectedShipping(null);
      const payload = {
        items: items.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),

        shippingAddress: {
          zipCode: checkout.zip,
          state: checkout.state,
          city: checkout.city,
          address1: checkout.address1,
          country: "US",
        },
      };

      const { data } = await api.post("/shipping/rates", payload);

      setShippingRates(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingRates(false);
    }
  };

  const handleContinueToPayment = async () => {
    try {
      // console.log("Customer Cart:", items);
      const payload = {
        items: items.map((item) => ({
          productId: item._id,
          name: item.name,
          sku: item.sku,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice,

          // Preserve product images with the order
          images: item.images || [],
        })),

        subtotal: subtotal,

        tax,

        shippingAddress: {
          firstName: checkout.firstName,
          lastName: checkout.lastName,
          address1: checkout.address1,
          address2: checkout.address2,
          city: checkout.city,
          state: checkout.state,
          zipCode: checkout.zip,
          country: "US",
          phone: checkout.phone,
          email: checkout.email,
        },

        shipping: {
          carrier: selectedShipping.carrier,
          service: selectedShipping.service,
          cost: shippingCost,
        },

        total: subtotal + tax + shippingCost,
        paymentMethod: "Stripe",
      };
      // console.log("Checkout Items:", items);
      // console.log(
      //   "Payload Items:",
      //   items.map((item) => ({
      //     productId: item._id,
      //     name: item.name,
      //     images: item.images,
      //   })),
      // );

      const { data } = await api.post(
        "/payments/create-checkout-session",
        payload,
      );

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
    }
  };

  const requiredFields = [
    "email",
    "firstName",
    "lastName",
    "address1",
    "city",
    "state",
    "zip",
  ];

  const isCheckoutValid = requiredFields.every(
    (field) => checkout[field].trim() !== "",
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-10 text-4xl font-bold">Checkout</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
        {/* Left Column */}
        <div className="space-y-10">
          {/* Contact */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold">Contact Information</h2>

            <div className="space-y-4">
              <input
                type="email"
                name="email"
                value={checkout.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full rounded-xl border p-4 outline-none focus:border-black"
              />

              <input
                type="tel"
                name="phone"
                value={checkout.phone}
                onChange={handleChange}
                placeholder="Phone Number (Optional)"
                className="w-full rounded-xl border p-4 outline-none focus:border-black"
              />
            </div>
          </section>

          {/* Shipping */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold">Shipping Address</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="firstName"
                value={checkout.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="rounded-xl border p-4"
              />
              <input
                name="lastName"
                value={checkout.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="rounded-xl border p-4"
              />
              <input
                name="address1"
                value={checkout.address1}
                onChange={handleChange}
                placeholder="Street Address"
                className="md:col-span-2 rounded-xl border p-4"
              />
              <input
                name="address2"
                value={checkout.address2}
                onChange={handleChange}
                placeholder="Apartment / Suite"
                className="md:col-span-2 rounded-xl border p-4"
              />
              <input
                name="city"
                value={checkout.city}
                onChange={handleChange}
                placeholder="City"
                className="rounded-xl border p-4"
              />
              <select
                name="state"
                value={checkout.state}
                onChange={handleChange}
                className="rounded-xl border bg-white p-4 outline-none focus:border-black"
              >
                <option value="">Select State</option>

                {US_STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
              <input
                name="zip"
                value={checkout.zip}
                onChange={handleChange}
                placeholder="ZIP Code"
                className="rounded-xl border p-4"
              />{" "}
            </div>
          </section>

          {/* Shipping Method */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold">Shipping Method</h2>
            <button
              type="button"
              onClick={fetchShippingRates}
              disabled={!isCheckoutValid || loadingRates}
              className="mb-4 w-full rounded-lg bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loadingRates ? "Calculating..." : "Calculate Shipping"}
            </button>
            {loadingRates && (
              <p className="text-gray-500">Calculating shipping...</p>
            )}

            {shippingRates.length > 0 &&
              shippingRates.map((rate) => (
                <label
                  key={rate.id}
                  className={`mb-3 flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                    selectedShipping?.id === rate.id
                      ? "border-black bg-gray-100"
                      : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shipping"
                      checked={selectedShipping?.id === rate.id}
                      onChange={() => setSelectedShipping(rate)}
                    />

                    <div>
                      <p className="font-semibold">{rate.service}</p>

                      <p className="text-sm text-gray-500">
                        {rate.estimatedDays} Business Days
                      </p>
                    </div>
                  </div>

                  <div className="font-bold">{formatCurrency(rate.cost)}</div>
                </label>
              ))}
          </section>
        </div>

        {/* Right Column */}
        <aside className="h-fit rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold">Order Summary</h2>

          <div className="space-y-5">
            {items.map((item) => (
              <div key={item.sku} className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>

                  <p className="text-sm text-gray-500">
                    {item.color} / {item.size}
                  </p>

                  <p className="text-sm">Qty: {item.quantity}</p>
                </div>

                <div className="font-semibold">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </div>
              </div>
            ))}

            <hr />

            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>

              <span>{formatCurrency(tax)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>

              <span>
                {!selectedShipping
                  ? "Not Selected"
                  : shippingCost === 0
                    ? "FREE"
                    : formatCurrency(shippingCost)}
              </span>
            </div>

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>

              <span>{formatCurrency(subtotal + tax + shippingCost)} </span>
            </div>

            <button
              onClick={handleContinueToPayment}
              disabled={!isCheckoutValid || !selectedShipping}
              className={`mt-6 w-full rounded-xl py-4 text-lg font-semibold transition ${
                isCheckoutValid && selectedShipping
                  ? "bg-black text-white hover:bg-gray-800"
                  : "cursor-not-allowed bg-gray-300 text-gray-500"
              }`}
            >
              Continue to Payment
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;

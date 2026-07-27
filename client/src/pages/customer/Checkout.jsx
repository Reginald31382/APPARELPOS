import { useState } from "react";
import useCartStore from "../../store/cart/useCartStore";
import { formatCurrency } from "../../utils/currency";

const Checkout = () => {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCheckout((prev) => ({
      ...prev,
      [name]: value,
    }));
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
              <input
                name="state"
                value={checkout.state}
                onChange={handleChange}
                placeholder="State"
                className="rounded-xl border p-4"
              />
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

            <p className="text-gray-500">
              USPS shipping options will appear after your address is entered.
            </p>
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

              <span>{formatCurrency(subtotal())}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>

              <span>Calculated Next</span>
            </div>

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>

              <span>{formatCurrency(subtotal())}</span>
            </div>

            <button
              disabled={!isCheckoutValid}
              className={`mt-6 w-full rounded-xl py-4 text-lg font-semibold transition ${
                isCheckoutValid
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

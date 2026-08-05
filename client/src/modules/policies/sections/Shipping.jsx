const Shipping = () => {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
        SHIPPING
      </p>

      <h2 className="mt-3 text-4xl font-bold">Shipping Information</h2>

      <div className="mt-12 space-y-10">
        <section>
          <h3 className="text-2xl font-semibold">Order Processing</h3>

          <p className="mt-4 leading-8 text-gray-600">
            Orders are typically processed within 1–3 business days. During
            holidays, promotions, or new product launches, processing times may
            be slightly longer.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold">Shipping Methods</h3>

          <p className="mt-4 leading-8 text-gray-600">
            Shipping rates and delivery estimates are calculated during
            checkout. Once your order has shipped, you'll receive a confirmation
            email with tracking information.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold">Free Shipping</h3>

          <p className="mt-4 leading-8 text-gray-600">
            Free standard shipping is available on qualifying orders. Any
            minimum purchase requirement will be displayed throughout the store
            and at checkout.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold">Order Tracking</h3>

          <p className="mt-4 leading-8 text-gray-600">
            After your package ships, you'll receive tracking information via
            email. You can also use the Order Tracking page to check your
            shipment status.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold">Shipping Delays</h3>

          <p className="mt-4 leading-8 text-gray-600">
            Delivery dates are estimates and may be affected by weather,
            holidays, or carrier delays beyond our control.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Shipping;

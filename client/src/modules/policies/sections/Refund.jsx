const Refund = () => {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
        EXCHANGES
      </p>

      <h2 className="mt-3 text-4xl font-bold">Exchange & Return Policy</h2>

      <div className="mt-12 space-y-10">
        <section>
          <h3 className="text-2xl font-semibold">Exchange Eligibility</h3>

          <p className="mt-4 leading-8 text-gray-600">
            We proudly stand behind the quality of every J.Rome product. If your
            purchase isn't the right size or fit, eligible items may be
            exchanged within <strong>30 days</strong> of the original purchase
            date.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold">Item Requirements</h3>

          <ul className="mt-5 list-disc space-y-3 pl-6 leading-8 text-gray-600">
            <li>Items must be unworn and unwashed.</li>
            <li>Original tags must still be attached.</li>
            <li>Items must be returned in their original condition.</li>
            <li>Proof of purchase is required.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-2xl font-semibold">How to Request an Exchange</h3>

          <ol className="mt-5 list-decimal space-y-3 pl-6 leading-8 text-gray-600">
            <li>Email us with your order number.</li>
            <li>Wait for your return authorization.</li>
            <li>Ship the item back using a trackable carrier.</li>
            <li>
              Once inspected, we'll ship your replacement item as quickly as
              possible.
            </li>
          </ol>
        </section>

        <section>
          <h3 className="text-2xl font-semibold">Non-Eligible Items</h3>

          <ul className="mt-5 list-disc space-y-3 pl-6 leading-8 text-gray-600">
            <li>Final Sale items.</li>
            <li>Gift Cards.</li>
            <li>Products showing signs of wear or damage.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-2xl font-semibold">
            Damaged or Incorrect Orders
          </h3>

          <p className="mt-4 leading-8 text-gray-600">
            If your order arrives damaged or you received the wrong item, please
            contact us immediately so we can make it right.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold">Need Assistance?</h3>

          <p className="mt-4 leading-8 text-gray-600">
            Questions about an exchange?
          </p>

          <a
            href="mailto:jromestudios1@gmail.com"
            className="mt-3 inline-block font-semibold text-black underline underline-offset-4"
          >
            jromestudios1@gmail.com
          </a>
        </section>
      </div>
    </div>
  );
};

export default Refund;

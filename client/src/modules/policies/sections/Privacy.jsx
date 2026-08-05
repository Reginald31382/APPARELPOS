const Privacy = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-6 py-20 lg:px-12">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
            PRIVACY
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Your privacy matters to us. This Privacy Policy explains what
            information J.Rome LLC collects, how we use it, and the steps we
            take to keep your information secure while you shop with us.
          </p>
        </div>

        <div className="mt-16 space-y-14">
          {/* Information */}
          <section>
            <h2 className="text-2xl font-semibold">Information We Collect</h2>

            <div className="mt-6 space-y-6 text-gray-600 leading-8">
              <div>
                <h3 className="font-semibold text-black">
                  Account Information
                </h3>

                <p>
                  When you create an account, we may collect your name, email
                  address, password, shipping information, and any additional
                  details you choose to provide.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-black">
                  Newsletter Subscription
                </h3>

                <p>
                  If you subscribe to our newsletter, we collect your email
                  address so we can send updates about new collections,
                  promotions, and exclusive releases. You can unsubscribe at any
                  time.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-black">
                  Payment Information
                </h3>

                <p>
                  J.Rome LLC does not store your credit or debit card
                  information. All payments are securely processed by
                  <span className="font-semibold"> Stripe</span>.
                </p>
              </div>
            </div>
          </section>

          {/* Use */}
          <section>
            <h2 className="text-2xl font-semibold">
              How We Use Your Information
            </h2>

            <ul className="mt-6 list-disc space-y-3 pl-6 leading-8 text-gray-600">
              <li>Process and fulfill your orders.</li>
              <li>Provide customer support.</li>
              <li>Improve your shopping experience.</li>
              <li>Send order confirmations and shipping updates.</li>
              <li>
                Share promotional emails and newsletters if you've subscribed.
              </li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold">Cookies & Analytics</h2>

            <p className="mt-6 leading-8 text-gray-600">
              We use cookies and similar technologies to keep you signed in,
              remember your preferences, and better understand how visitors use
              our website. This information helps us improve your experience.
            </p>
          </section>

          {/* Third Party */}
          <section>
            <h2 className="text-2xl font-semibold">Third-Party Services</h2>

            <p className="mt-6 leading-8 text-gray-600">
              We work with trusted third-party providers such as Stripe to
              securely process payments and help deliver our services. These
              providers maintain their own privacy and security practices.
            </p>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-semibold">Data Security</h2>

            <p className="mt-6 leading-8 text-gray-600">
              We take reasonable administrative and technical measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction.
            </p>
          </section>

          {/* Rights */}
          <section>
            <h2 className="text-2xl font-semibold">Your Rights</h2>

            <p className="mt-6 leading-8 text-gray-600">
              You may request access to, correction of, or deletion of your
              personal information. You may also opt out of promotional emails
              at any time using the unsubscribe link included in our emails.
            </p>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-semibold">Policy Updates</h2>

            <p className="mt-6 leading-8 text-gray-600">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page along with the updated effective date.
            </p>
          </section>

          {/* Contact */}
          <section className="rounded-2xl bg-gray-50 p-8">
            <h2 className="text-2xl font-semibold">Contact Us</h2>

            <p className="mt-4 leading-8 text-gray-600">
              Questions about this Privacy Policy?
            </p>

            <a
              href="mailto:jromestudios1@gmail.com"
              className="mt-4 inline-block font-semibold text-black underline underline-offset-4"
            >
              jromestudios1@gmail.com
            </a>
          </section>
        </div>
      </div>
    </section>
  );
};

export default Privacy;

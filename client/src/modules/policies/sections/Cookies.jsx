const Cookies = () => {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
        COOKIES
      </p>

      <h2 className="mt-3 text-4xl font-bold">Cookie Policy</h2>

      <div className="mt-12 space-y-10">
        <section>
          <h3 className="text-2xl font-semibold">What Are Cookies?</h3>

          <p className="mt-4 leading-8 text-gray-600">
            Cookies are small text files stored on your device that help improve
            your browsing experience.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold">How We Use Cookies</h3>

          <ul className="mt-5 list-disc space-y-3 pl-6 leading-8 text-gray-600">
            <li>Remember your shopping cart.</li>
            <li>Keep you signed in.</li>
            <li>Improve website performance.</li>
            <li>Analyze website traffic.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-2xl font-semibold">Managing Cookies</h3>

          <p className="mt-4 leading-8 text-gray-600">
            Most browsers allow you to disable or remove cookies through their
            settings. Some features of the website may not function correctly if
            cookies are disabled.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Cookies;

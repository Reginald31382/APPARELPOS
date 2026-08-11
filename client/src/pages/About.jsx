const About = () => {
  return (
    <section className="bg-white">
      <div>
        <img
          src="https://i.postimg.cc/9QCLhrdv/jrome-leo-szn.png"
          alt="J.Rome"
          className="w-48 sm:w-56"
        />
      </div>
      <div className="mx-auto max-w-5xl px-6 py-20 lg:px-12">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
            ABOUT J.ROME
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Designed with Purpose.
            <br />
            Built for Everyday Confidence.
          </h1>
        </div>

        <div className="mx-auto mt-14 max-w-3xl space-y-8 text-lg leading-9 text-gray-600">
          <p>
            J.Rome was founded on a simple belief: premium apparel should be
            comfortable, timeless, and made with purpose. Every collection is
            designed for people who value quality over trends and confidence
            over excess.
          </p>

          <p>
            Our garments are thoughtfully selected with an emphasis on
            <span className="font-semibold text-black"> 100% cotton</span>,
            delivering the comfort, durability, and breathable feel that make a
            difference every time you wear them. We believe great clothing
            starts with great materials.
          </p>

          <p>
            While J.Rome began as a creative brand focused on design and
            branding, it has evolved into a lifestyle apparel company built
            around craftsmanship, simplicity, and everyday wear. Every piece is
            created to become a staple in your wardrobe—not just another item in
            your closet.
          </p>

          <p>
            Whether you're representing your city, expressing your personal
            style, or simply looking for apparel you can rely on, J.Rome is
            committed to providing premium-quality products that you'll be proud
            to wear.
          </p>
        </div>

        <div className="mt-16 border-t pt-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
            Premium Materials. Timeless Style. Built to Last.
          </p>

          <h2 className="mt-2 text-3xl font-bold">SINCE 2010</h2>
        </div>
      </div>
    </section>
  );
};

export default About;

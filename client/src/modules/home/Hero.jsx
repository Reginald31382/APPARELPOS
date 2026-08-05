import { Link } from "react-router-dom";
import heroImage from "../../assets/images/LoveDetroitHeropg.png";

const Hero = () => {
  return (
    <section className="relative min-h-[calc(100svh-104px)] overflow-hidden">
      {/* Background */}
      <img
        src={heroImage}
        alt="J.Rome Hero"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[calc(100svh-104px)] items-center">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-xl">
            <p className="font-great-vibes text-4xl text-white sm:text-5xl lg:text-6xl">
              J.Rome
            </p>

            <h1 className="mt-4 text-4xl font-bold uppercase leading-tight text-white sm:text-5xl lg:mt-6 lg:text-7xl">
              Wear Confidence.
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-gray-200 sm:text-lg sm:leading-8">
              Premium apparel curated for those who value quality over quantity.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
              <Link
                to="/shop"
                className="rounded-lg bg-white px-8 py-4 text-center font-semibold uppercase tracking-wide text-black transition hover:bg-gray-200"
              >
                Explore Collection
              </Link>

              <Link
                to="/shop?sort=newest"
                className="rounded-lg border border-white px-8 py-4 text-center font-semibold uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import { Link } from "react-router-dom";
import heroImage from "../../assets/images/LoveDetroitHeropg.png"; // we'll replace this with your image

const Hero = () => {
  return (
    <section className="relative h-[calc(100vh-104px)] overflow-hidden">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="J.Rome Hero"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
          <div className="max-w-xl">
            <p className="font-great-vibes text-6xl text-white">J.Rome</p>

            <h1 className="mt-6 text-5xl font-bold uppercase leading-tight text-white lg:text-7xl">
              Wear Confidence.
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-200">
              Premium apparel curated for those who value quality over quantity.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="bg-white px-8 py-4 font-semibold uppercase tracking-wide text-black transition hover:bg-gray-200"
              >
                Explore Collection
              </Link>

              <Link
                to="/shop?sort=newest"
                className="border border-white px-8 py-4 font-semibold uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
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

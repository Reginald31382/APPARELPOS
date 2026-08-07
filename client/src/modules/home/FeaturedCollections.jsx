import { Link } from "react-router-dom";

const collections = [
  {
    title: "Men",
    image: "https://i.postimg.cc/VkqkPfGh/jrome-mens-collection-II.png",
    link: "/shop?gender=Men",
  },
  {
    title: "Women",
    image: "https://i.postimg.cc/MGkJ2vvx/jrome-womens-collection-IV.png",
    link: "/shop?gender=Women",
  },
  {
    title: "Kids",
    image: "https://i.postimg.cc/3JwqHnL7/jrome-kids-collection.png",
    link: "/shop?gender=Kids",
  },
];

const FeaturedCollections = () => {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
              Shop by Collection
            </p>

            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Designed for every chapter.
            </h2>
          </div>

          <Link
            to="/shop"
            className="hidden border-b border-black pb-1 text-sm uppercase tracking-widest md:block"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.title}
              to={collection.link}
              className="group overflow-hidden"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/20" />

                <div className="absolute bottom-5 left-5 text-white sm:bottom-8 sm:left-8">
                  <h3 className="text-3xl font-semibold sm:text-4xl">
                    {collection.title}
                  </h3>
                  <p className="mt-2 uppercase tracking-widest">Explore →</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;

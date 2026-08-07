import { Link } from "react-router-dom";

import ProductGrid from "../product/ProductGrid";
import StoreProductCard from "../product/StoreProductCard";

const NewArrivals = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-10 flex items-end justify-between sm:mb-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-gray-500">
              NEW ARRIVALS
            </p>

            <h2 className="mt-4 text-3xl font-light tracking-tight sm:text-5xl">
              Fresh Drops
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden border-b border-black pb-1 text-sm uppercase tracking-[0.25em] transition hover:opacity-60 md:block"
          >
            View All
          </Link>
        </div>
        <ProductGrid
          CardComponent={StoreProductCard}
          filters={{
            search: "",
            category: "",
            gender: "",
            brand: "",
            featured: false,
            sort: "newest",
            latest: true,
          }}
        />
      </div>
    </section>
  );
};

export default NewArrivals;

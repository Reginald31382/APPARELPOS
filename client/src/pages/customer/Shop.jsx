import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

import SEO from "../../components/SEO";
import ProductGrid from "../../modules/product/ProductGrid";
import useProductStore from "../../store/product/useProductStore";

const departments = [
  {
    title: "Unisex",
    description: "Everyday essentials designed for everybody.",
    filters: { gender: "Unisex" },
    path: "/shop?gender=Unisex",
  },
  {
    title: "Women",
    description: "Styles made to express your individuality.",
    filters: { gender: "Women" },
    path: "/shop?gender=Women",
  },
  {
    title: "Men",
    description: "Elevated streetwear and everyday staples.",
    filters: { gender: "Men" },
    path: "/shop?gender=Men",
  },
  {
    title: "Kids",
    description: "Comfortable styles for the next generation.",
    filters: { gender: "Kids" },
    path: "/shop?gender=Kids",
  },
  {
    title: "Accessories",
    description: "The finishing touches to complete your look.",
    filters: { category: "Accessories" },
    path: "/shop?category=Accessories",
  },
];

const neutralFilters = {
  search: "",
  category: "",
  gender: "",
  brand: "",
  featured: false,
  sort: "newest",
  latest: false,
};

const Shop = () => {
  const [searchParams] = useSearchParams();

  const setCategory = useProductStore((state) => state.setCategory);
  const setGender = useProductStore((state) => state.setGender);
  const setSearch = useProductStore((state) => state.setSearch);
  const setBrand = useProductStore((state) => state.setBrand);
  const setFeatured = useProductStore((state) => state.setFeatured);
  const setSort = useProductStore((state) => state.setSort);

  const category = searchParams.get("category") || "";
  const gender = searchParams.get("gender") || "";

  const hasUrlFilter = Boolean(category || gender);

  useEffect(() => {
    setCategory(category);
    setGender(gender);
    setSearch("");
    setBrand("");
    setFeatured(false);
    setSort("newest");
  }, [
    category,
    gender,
    setCategory,
    setGender,
    setSearch,
    setBrand,
    setFeatured,
    setSort,
  ]);

  return (
    <>
      <SEO
        title="Shop Urban Apparel & Streetwear"
        description="Shop J.Rome Studios urban apparel and streetwear, including graphic tees, hoodies, shirts, and fashion for men, women, and kids."
        path="/shop"
      />

      <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <header className="mb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-500">
            J.Rome Studios
          </p>

          <h1 className="text-3xl font-semibold uppercase tracking-[0.18em] text-black sm:text-4xl">
            {hasUrlFilter ? category || gender : "The Collection"}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500">
            Discover the latest styles, everyday essentials, and statement
            pieces from J.Rome Studios.
          </p>
        </header>

        {hasUrlFilter ? (
          <ProductGrid
            filters={{
              ...neutralFilters,
              category,
              gender,
            }}
            emptyMessage={
              category
                ? `${category} coming soon.`
                : `${gender} styles coming soon.`
            }
          />
        ) : (
          <div className="space-y-20">
            {departments.map((department, index) => (
              <section key={department.title}>
                <div className="mb-7 flex items-end justify-between gap-4 border-b border-gray-200 pb-4">
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-gray-400">
                      Collection 0{index + 1}
                    </p>

                    <h2 className="text-2xl font-semibold uppercase tracking-[0.16em] text-black sm:text-3xl">
                      {department.title}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      {department.description}
                    </p>
                  </div>

                  <Link
                    to={department.path}
                    className="shrink-0 border-b border-black pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] transition hover:text-gray-500"
                  >
                    View All
                  </Link>
                </div>

                <ProductGrid
                  filters={{
                    ...neutralFilters,
                    ...department.filters,
                  }}
                  compactEmpty
                  emptyMessage="New arrivals coming soon."
                />
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default Shop;

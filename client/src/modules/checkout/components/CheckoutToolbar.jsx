import useProductStore from "../../../store/product/useProductStore";
import useProducts from "../../../hooks/useProducts";
import {
  Search,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";

const genders = ["All", "Men", "Women", "Kids", "Unisex"];

const POSHeader = () => {
  const {
    search,
    category,
    gender,
    featured,
    setSearch,
    setCategory,
    setGender,
    setFeatured,
    clearFilters,
    sort,
    setSort,
  } = useProductStore();

  const { data: products = [] } = useProducts();

  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
        .sort(),
    ),
  ];

  const searchRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault();

        searchRef.current?.focus();
        searchRef.current?.select();
      }

      if (event.key === "Escape") {
        setSearch("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setSearch]);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  return (
    <div className="border-b bg-white">
      {/* Compact Toolbar */}
      <div className="flex items-center gap-3 p-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            ref={searchRef}
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border py-3 pl-10 pr-4 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Filter Toggle */}
        <button
          type="button"
          onClick={() => setFiltersOpen((prev) => !prev)}
          className={`flex shrink-0 items-center gap-2 rounded-lg border px-4 py-3 font-medium transition ${
            filtersOpen ? "bg-black text-white" : "bg-white hover:bg-gray-100"
          }`}
          aria-expanded={filtersOpen}
          aria-label={filtersOpen ? "Hide filters" : "Show filters"}
        >
          <SlidersHorizontal size={18} />

          <span className="hidden sm:inline">
            {filtersOpen ? "Hide Filters" : "Filters"}
          </span>

          {filtersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Collapsible Filters */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          filtersOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-5 border-t px-4 pb-4 pt-4">
            {/* Gender */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Gender
              </p>

              <div className="flex flex-wrap gap-2">
                {genders.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setGender(item === "All" ? "" : item)}
                    className={`rounded-full border px-4 py-2 transition ${
                      gender === (item === "All" ? "" : item)
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Category
              </p>

              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item === "All" ? "" : item)}
                    className={`rounded-full border px-4 py-2 transition ${
                      category === (item === "All" ? "" : item)
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFeatured(!featured)}
                className={`rounded-full border px-4 py-2 transition ${
                  featured
                    ? "bg-yellow-400 border-yellow-400"
                    : "hover:bg-gray-100"
                }`}
              >
                ⭐ Featured
              </button>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border px-3 py-2 outline-none focus:border-black"
              >
                <option value="newest">Newest</option>
                <option value="name">A-Z</option>
                <option value="priceLow">Price ↑</option>
                <option value="priceHigh">Price ↓</option>
                <option value="featured">Featured</option>
              </select>

              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full border px-4 py-2 transition hover:bg-gray-100"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSHeader;

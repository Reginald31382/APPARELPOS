import useProductStore from "../../../store/product/useProductStore";
import CartSummary from "./CustomerSummary";
import CustomerAutocomplete from "../../customer/CustomerAutoComplete";
import { Search } from "lucide-react";
import { useRef, useEffect } from "react";

const categories = ["All", "Men", "Women", "Kids", "Accessories", "Shoes"];

const POSHeader = () => {
  const {
    search,
    category,
    featured,
    setSearch,
    setCategory,
    setFeatured,
    clearFilters,
    sort,
    setSort,
  } = useProductStore();

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
  }, []);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  return (
    <div className="space-y-4 border-b bg-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">J.Rome POS</h1>

        <CartSummary />
      </div>

      {/* Customer Section */}
      <div>
        <h2 className="mb-2 font-semibold">Customer</h2>

        <CustomerAutocomplete />
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          ref={searchRef}
          type="text"
          placeholder="Search products, SKU, or barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border py-3 pl-10 pr-4"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item === "All" ? "" : item)}
            className={`rounded-full border px-4 py-2
            ${
              category === (item === "All" ? "" : item)
                ? "bg-black text-white"
                : ""
            }`}
          >
            {item}
          </button>
        ))}

        <button
          onClick={() => setFeatured(!featured)}
          className={`rounded-full border px-4 py-2
          ${featured ? "bg-yellow-400" : ""}`}
        >
          ⭐ Featured
        </button>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="newest">Newest</option>
          <option value="name">A-Z</option>
          <option value="priceLow">Price ↑</option>
          <option value="priceHigh">Price ↓</option>
          <option value="featured">Featured</option>
        </select>
        <button
          onClick={clearFilters}
          className="rounded-full border px-4 py-2"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default POSHeader;

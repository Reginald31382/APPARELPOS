import useProductStore from "../../../store/product/useProductStore";
import CartSummary from "./CustomerSummary";
import CustomerAutocomplete from "../../customer/CustomerAutoComplete";

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

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border p-3"
      />

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

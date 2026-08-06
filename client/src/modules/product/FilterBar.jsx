import useProductStore from "../../store/product/useProductStore";

const categories = [
  "All",
  "Shirts",
  "Hoodies",
  "Pants",
  "Shorts",
  "Accessories",
  "Hats",
];

const FilterBar = () => {
  const { category, brand, setCategory, setBrand, clearFilters } =
    useProductStore();

  return (
    <div className="flex flex-wrap gap-3 p-3">
      {categories.map((item) => (
        <button
          key={item}
          onClick={() => setCategory(item === "All" ? "" : item)}
          className={`rounded-lg border px-4 py-2 transition ${
            (item === "All" && category === "") || category === item
              ? "bg-black text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {item}
        </button>
      ))}

      <button
        onClick={() => setBrand(brand === "J.Rome" ? "" : "J.Rome")}
        className={`rounded-lg border px-4 py-2 transition ${
          brand === "J.Rome" ? "bg-black text-white" : "hover:bg-gray-100"
        }`}
      >
        J.Rome
      </button>

      <button
        onClick={clearFilters}
        className="rounded-lg border px-4 py-2 transition hover:bg-gray-100"
      >
        Reset
      </button>
    </div>
  );
};

export default FilterBar;

import useFilterStore from "../../store/useFilterStore";

const SearchBar = () => {
  const search = useFilterStore((s) => s.search);
  const setSearch = useFilterStore((s) => s.setSearch);

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search products, SKU, barcode..."
      className="w-full rounded-md border px-4 py-2"
    />
  );
};

export default SearchBar;

import useProductStore from "../../store/product/useProductStore";

const ProductSearch = () => {
  const search = useProductStore((state) => state.search);
  const setSearch = useProductStore((state) => state.setSearch);

  return (
    <input
      className="w-full rounded-lg border p-3"
      placeholder="Search name, SKU, barcode..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default ProductSearch;

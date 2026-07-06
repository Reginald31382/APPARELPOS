import { Search } from "lucide-react";

const SearchBox = () => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 text-gray-400" size={18} />

      <input
        placeholder="Search products, SKU, barcode..."
        className="w-full rounded-lg border py-3 pl-10 pr-4"
      />
    </div>
  );
};

export default SearchBox;

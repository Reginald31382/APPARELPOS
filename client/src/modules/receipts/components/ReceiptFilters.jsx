import { Search } from "lucide-react";

const ReceiptFilters = ({ search, setSearch, filter, setFilter }) => {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-4">
      {/* Search */}
      <div className="relative min-w-0 flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search receipt, order, or customer..."
          className="w-full rounded-lg border py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
        />
      </div>

      {/* Filter */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-40 sm:text-base"
      >
        <option value="All">All Receipts</option>
        <option value="POS">POS</option>
        <option value="Online">Online</option>
      </select>
    </div>
  );
};

export default ReceiptFilters;

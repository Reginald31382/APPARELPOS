import { Search } from "lucide-react";

const ReceiptFilters = ({ search, setSearch, filter, setFilter }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-white p-4">
      <div className="relative flex-1 min-w-[280px]">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search receipt, order, or customer..."
          className="w-full rounded-lg border py-3 pl-10 pr-4"
        />
      </div>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="rounded-lg border px-4 py-3"
      >
        <option value="All">All</option>
        <option value="POS">POS</option>
        <option value="Online">Online</option>
      </select>
    </div>
  );
};

export default ReceiptFilters;

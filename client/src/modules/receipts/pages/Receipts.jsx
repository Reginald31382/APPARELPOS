import { useState } from "react";

import ReceiptSummaryCards from "../components/ReceiptSummaryCards";
import ReceiptToolbar from "../components/ReceiptToolbar";
import ReceiptFilters from "../components/ReceiptFilters";
import ReceiptTable from "../components/ReceiptTable";
import ReceiptDrawer from "../components/ReceiptDrawer";

const Receipts = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  return (
    <div className="min-w-0 space-y-5 p-4 sm:space-y-6 sm:p-6">
      {/* Receipt Summary */}
      <section className="min-w-0">
        <ReceiptSummaryCards />
      </section>

      {/* Receipt Actions */}
      <section className="min-w-0">
        <ReceiptToolbar />
      </section>

      {/* Search and Filters */}
      <section className="min-w-0">
        <ReceiptFilters
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />
      </section>

      {/* Receipt Records */}
      <section className="min-w-0">
        <ReceiptTable search={search} filter={filter} />
      </section>

      <ReceiptDrawer />
    </div>
  );
};

export default Receipts;

import ReceiptSummaryCards from "../components/ReceiptSummaryCards";
import ReceiptToolbar from "../components/ReceiptToolbar";
import ReceiptFilters from "../components/ReceiptFilters";
import ReceiptTable from "../components/ReceiptTable";
import ReceiptDrawer from "../components/ReceiptDrawer";
import { useState } from "react";

const Receipts = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  return (
    <div className="space-y-6 p-6">
      <ReceiptSummaryCards />

      <ReceiptToolbar />

      <ReceiptFilters
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />

      <ReceiptTable search={search} filter={filter} />

      <ReceiptDrawer />
    </div>
  );
};

export default Receipts;

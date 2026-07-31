const filters = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last 30 Days", value: "last30" },
  { label: "This Month", value: "month" },
  { label: "Last Month", value: "lastMonth" },
  { label: "Custom", value: "custom" },
];

const ReportFilters = ({ filters: selected, onChange }) => {
  const updateCustom = (field, value) => {
    onChange({
      ...selected,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() =>
              onChange({
                range: filter.value,
                start: "",
                end: "",
              })
            }
            className={`rounded-lg px-4 py-2 transition ${
              selected.range === filter.value
                ? "bg-blue-600 text-white"
                : "border hover:bg-gray-100"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {selected.range === "custom" && (
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">From</label>

            <input
              type="date"
              value={selected.start || ""}
              onChange={(e) => updateCustom("start", e.target.value)}
              className="rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">To</label>

            <input
              type="date"
              value={selected.end || ""}
              onChange={(e) => updateCustom("end", e.target.value)}
              className="rounded-lg border px-3 py-2"
            />
          </div>

          <button
            onClick={() =>
              onChange({
                ...selected,
              })
            }
            className="rounded-lg bg-blue-600 px-5 py-2 text-white"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportFilters;

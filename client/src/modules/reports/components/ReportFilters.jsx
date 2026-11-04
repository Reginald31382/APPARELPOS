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
    <div className="min-w-0 space-y-4">
      <div>
        <p className="mb-3 text-sm font-semibold text-gray-700">
          Reporting Period
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() =>
                onChange({
                  range: filter.value,
                  start: "",
                  end: "",
                })
              }
              aria-pressed={selected.range === filter.value}
              className={`min-h-11 rounded-lg px-3 py-2 text-sm font-medium transition sm:px-4 ${
                selected.range === filter.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {selected.range === "custom" && (
        <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3 sm:p-4">
          <p className="mb-3 text-sm font-semibold text-gray-700">
            Custom Date Range
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
            <div className="min-w-0">
              <label
                htmlFor="report-start-date"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                From
              </label>

              <input
                id="report-start-date"
                type="date"
                value={selected.start || ""}
                max={selected.end || undefined}
                onChange={(e) => updateCustom("start", e.target.value)}
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:w-auto"
              />
            </div>

            <div className="min-w-0">
              <label
                htmlFor="report-end-date"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                To
              </label>

              <input
                id="report-end-date"
                type="date"
                min={selected.start || undefined}
                value={selected.end || ""}
                onChange={(e) => updateCustom("end", e.target.value)}
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:w-auto"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                onChange({
                  ...selected,
                })
              }
              disabled={!selected.start || !selected.end}
              className="min-h-11 w-full rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
            >
              Apply Date Range
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportFilters;

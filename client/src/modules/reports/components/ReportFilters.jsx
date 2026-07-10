const ReportFilters = () => {
  return (
    <div className="flex flex-wrap gap-3">
      <button className="rounded-lg bg-blue-600 px-4 py-2 text-white">
        Today
      </button>

      <button className="rounded-lg border px-4 py-2">This Week</button>

      <button className="rounded-lg border px-4 py-2">This Month</button>

      <button className="rounded-lg border px-4 py-2">Custom Range</button>
    </div>
  );
};

export default ReportFilters;

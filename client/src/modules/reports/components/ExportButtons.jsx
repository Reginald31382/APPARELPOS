const ExportButtons = () => {
  return (
    <div className="flex flex-wrap gap-4">
      <button className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700">
        Export CSV
      </button>

      <button className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700">
        Export Excel
      </button>

      <button className="rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-black">
        Print Report
      </button>
    </div>
  );
};

export default ExportButtons;

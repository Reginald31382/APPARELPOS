import {
  exportCSV,
  exportExcel,
  exportPDF,
} from "../services/reportExportService";

const ExportButtons = ({ filters, summary, sales, orders, inventory }) => {
  const report = {
    filters,
    summary,
    sales,
    orders,
    inventory,
  };

  const buttonStyles =
    "min-h-11 w-full rounded-lg px-4 py-3 text-sm font-semibold text-white transition sm:w-auto sm:px-5";

  return (
    <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:gap-3">
      <button
        type="button"
        onClick={() => exportCSV(report)}
        className={`${buttonStyles} bg-blue-600 hover:bg-blue-700`}
      >
        Export CSV
      </button>

      <button
        type="button"
        onClick={() => exportExcel(report)}
        className={`${buttonStyles} bg-green-600 hover:bg-green-700`}
      >
        Export Excel
      </button>

      <button
        type="button"
        onClick={() => exportPDF(report)}
        className={`${buttonStyles} bg-gray-900 hover:bg-black`}
      >
        Export PDF
      </button>
    </div>
  );
};

export default ExportButtons;

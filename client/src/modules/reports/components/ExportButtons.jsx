import {
  exportCSV,
  exportExcel,
  exportPDF,
} from "../services/reportExportService";

const ExportButtons = ({ orders }) => {
  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={() => exportCSV(orders)}
        className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
      >
        Export CSV
      </button>

      <button
        onClick={() => exportExcel(orders)}
        className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700"
      >
        Export Excel
      </button>

      <button
        onClick={() => exportPDF(orders)}
        className="rounded-lg bg-gray-900 px-5 py-3 font-medium text-white hover:bg-black"
      >
        Export PDF
      </button>
    </div>
  );
};

export default ExportButtons;

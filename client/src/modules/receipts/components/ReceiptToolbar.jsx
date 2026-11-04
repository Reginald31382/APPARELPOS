const ReceiptToolbar = () => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Receipts</h1>

      <button
        type="button"
        className="w-full rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto sm:text-base"
      >
        Export
      </button>
    </div>
  );
};

export default ReceiptToolbar;

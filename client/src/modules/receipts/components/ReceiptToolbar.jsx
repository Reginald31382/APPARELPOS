const ReceiptToolbar = () => {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-4">
      <h1 className="text-3xl font-bold">Receipts</h1>

      <button className="rounded-lg bg-black px-5 py-3 font-semibold text-white">
        Export
      </button>
    </div>
  );
};

export default ReceiptToolbar;

const LowInventoryTable = ({ products = [] }) => {
  return (
    <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
          Low Inventory
        </h2>

        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Products with the lowest available stock.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg bg-green-50 p-5 text-center">
          <p className="font-medium text-green-700">No low inventory items</p>
          <p className="mt-1 text-sm text-green-600">
            Your inventory is sufficiently stocked.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => {
            const variants = product.variants || [];

            const lowestVariant = variants.length
              ? variants.reduce((lowest, variant) =>
                  variant.quantity < lowest.quantity ? variant : lowest,
                )
              : null;

            return (
              <div
                key={product._id}
                className="flex min-w-0 flex-col gap-3 rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-semibold text-gray-900 sm:text-base">
                    {product.name}
                  </p>

                  {lowestVariant ? (
                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                      {lowestVariant.color || "N/A"} /{" "}
                      {lowestVariant.size || "N/A"}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-400">
                      No variants available
                    </p>
                  )}
                </div>

                {lowestVariant && (
                  <span
                    className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold sm:text-sm ${
                      lowestVariant.quantity === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {lowestVariant.quantity} left
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LowInventoryTable;

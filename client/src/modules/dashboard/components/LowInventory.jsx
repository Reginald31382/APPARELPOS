const LowInventory = ({ products = [] }) => {
  return (
    <div className="min-w-0 rounded-xl border bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="mb-4 flex items-center justify-between gap-2 sm:mb-5">
        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
          Low Inventory
        </h2>

        <span className="text-xs text-gray-500 sm:text-sm">
          {products.length} {products.length === 1 ? "item" : "items"}
        </span>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg bg-gray-50 px-4 py-8 text-center">
          <p className="text-sm text-gray-500">
            All inventory levels look good.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => {
            const variants = product.variants ?? [];

            if (variants.length === 0) return null;

            const lowestVariant = variants.reduce((lowest, variant) =>
              variant.quantity < lowest.quantity ? variant : lowest,
            );

            return (
              <div
                key={product._id}
                className="flex min-w-0 items-center justify-between gap-3 rounded-lg border p-3 sm:p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                    {product.name}
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-500 sm:text-sm">
                    {lowestVariant.color} • {lowestVariant.size}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 sm:px-3 sm:text-sm">
                  {lowestVariant.quantity} Left
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LowInventory;

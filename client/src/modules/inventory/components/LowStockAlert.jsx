import useInventory from "@/hooks/useInventory";

const LowStockAlert = ({ onSelectItem }) => {
  const { data = [] } = useInventory();

  const lowStockItems = [];

  data.forEach((product) => {
    product.variants.forEach((variant) => {
      if (variant.quantity <= 5) {
        lowStockItems.push({
          id: `${product._id}-${variant.sku}`,
          name: product.name,
          sku: variant.sku,
          color: variant.color,
          size: variant.size,
          quantity: variant.quantity,
        });
      }
    });
  });

  if (lowStockItems.length === 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 sm:p-6">
        <h2 className="text-base font-bold text-green-700 sm:text-lg">
          ✓ No Low Stock Items
        </h2>

        <p className="mt-2 text-sm text-green-600 sm:text-base">
          Everything is sufficiently stocked.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-4 sm:p-5">
        <h2 className="text-lg font-bold text-red-600 sm:text-xl">
          ⚠ Low Stock Alerts
        </h2>

        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          {lowStockItems.length} inventory variant
          {lowStockItems.length !== 1 ? "s" : ""} need attention
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {lowStockItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectItem?.(item)}
            className="flex w-full min-w-0 flex-col gap-3 p-4 text-left transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <div className="min-w-0 flex-1">
              <h3 className="break-words text-sm font-semibold text-gray-900 sm:text-base">
                {item.name}
              </h3>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                {item.color || "N/A"} • {item.size || "N/A"}
              </p>

              <p className="mt-1 break-all text-xs text-gray-400">
                SKU: {item.sku || "N/A"}
              </p>
            </div>

            <span
              className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold sm:text-sm ${
                item.quantity === 0
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {item.quantity === 0 ? "Out of Stock" : `${item.quantity} Left`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LowStockAlert;

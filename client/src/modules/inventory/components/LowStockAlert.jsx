import useInventory from "../hooks/useInventory";

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
      <div className="rounded-xl border bg-green-50 p-6">
        <h2 className="text-lg font-bold text-green-700">
          ✓ No Low Stock Items
        </h2>

        <p className="mt-2 text-green-600">
          Everything is sufficiently stocked.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-xl font-bold text-red-600">⚠ Low Stock Alerts</h2>
      </div>

      <div className="divide-y">
        {lowStockItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectItem(item)}
            className="flex cursor-pointer items-center justify-between p-4 transition hover:bg-gray-50"
          >
            {" "}
            <div>
              <h3 className="font-semibold">{item.name}</h3>

              <p className="text-sm text-gray-500">
                {item.color} • {item.size}
              </p>

              <p className="text-xs text-gray-400">{item.sku}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                item.quantity === 0
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {item.quantity === 0 ? "Out of Stock" : `${item.quantity} Left`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockAlert;

const LowInventoryTable = ({ products }) => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Low Inventory</h2>

      <div className="space-y-4">
        {products.map((product) => {
          const lowestVariant = product.variants.reduce(
            (lowest, variant) =>
              variant.quantity < lowest.quantity ? variant : lowest,
            product.variants[0],
          );

          return (
            <div
              key={product._id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-medium">{product.name}</p>

                <p className="text-sm text-gray-500">
                  {lowestVariant.color} / {lowestVariant.size}
                </p>
              </div>

              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                {lowestVariant.quantity} left
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LowInventoryTable;

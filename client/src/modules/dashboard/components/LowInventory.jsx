const LowInventory = ({ products = [] }) => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-bold">Low Inventory</h2>

      {products.length === 0 ? (
        <p className="text-gray-500">All inventory levels look good.</p>
      ) : (
        <div className="space-y-3">
          {products.map((product) => {
            const lowestVariant = product.variants.reduce((lowest, variant) =>
              variant.quantity < lowest.quantity ? variant : lowest,
            );

            return (
              <div
                key={product._id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-semibold">{product.name}</p>

                  <p className="text-sm text-gray-500">
                    {lowestVariant.color} • {lowestVariant.size}
                  </p>
                </div>

                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
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

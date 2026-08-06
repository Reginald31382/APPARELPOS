import InventoryCard from "./InventoryCard";

const InventoryGrid = ({ product, refetch }) => {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventory</h2>

          <p className="mt-1 text-gray-500">
            Manage inventory for each product variant.
          </p>
        </div>

        <div className="rounded-xl border bg-gray-50 px-4 py-2">
          <span className="text-sm text-gray-500">Total Variants</span>

          <p className="text-2xl font-bold">{product.variants.length}</p>
        </div>
      </div>

      {product.variants.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-gray-500">
          No inventory variants found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {product.variants.map((variant) => (
            <InventoryCard
              key={variant.sku}
              variant={variant}
              refetch={refetch}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default InventoryGrid;

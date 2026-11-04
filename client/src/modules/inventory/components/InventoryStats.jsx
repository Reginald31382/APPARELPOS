import useInventory from "@/modules/product/hooks/useInventory";

const InventoryStats = () => {
  const { data = [] } = useInventory();

  const totalProducts = data.length;

  let lowStock = 0;
  let outOfStock = 0;
  let inventoryValue = 0;

  data.forEach((product) => {
    product.variants.forEach((variant) => {
      inventoryValue += variant.quantity * product.price;

      if (variant.quantity === 0) {
        outOfStock++;
      } else if (variant.quantity <= 5) {
        lowStock++;
      }
    });
  });

  const Card = ({ title, value, description }) => (
    <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <p className="text-xs font-medium text-gray-500 sm:text-sm">{title}</p>

      <h2 className="mt-2 break-words text-2xl font-bold text-gray-900 sm:text-3xl">
        {value}
      </h2>

      {description && (
        <p className="mt-1 text-xs text-gray-400 sm:text-sm">{description}</p>
      )}
    </div>
  );

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 xl:grid-cols-4">
      <Card
        title="Products"
        value={totalProducts}
        description="Total products"
      />

      <Card
        title="Low Stock"
        value={lowStock}
        description="1–5 units remaining"
      />

      <Card
        title="Out of Stock"
        value={outOfStock}
        description="No units available"
      />

      <Card
        title="Inventory Value"
        value={`$${inventoryValue.toFixed(2)}`}
        description="Estimated inventory value"
      />
    </div>
  );
};

export default InventoryStats;

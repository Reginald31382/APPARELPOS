import useInventory from "../hooks/useInventory";

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

  const Card = ({ title, value }) => (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>

      <h2 className="mt-2 text-3xl font-bold">{value}</h2>
    </div>
  );

  return (
    <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <Card title="Products" value={totalProducts} />

      <Card title="Low Stock" value={lowStock} />

      <Card title="Out of Stock" value={outOfStock} />

      <Card title="Inventory Value" value={`$${inventoryValue.toFixed(2)}`} />
    </div>
  );
};

export default InventoryStats;

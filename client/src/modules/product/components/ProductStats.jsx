const ProductStats = ({ product }) => {
  const retail = Number(product.price || 0);
  const wholesale = Number(product.cost || 0);

  const profit = retail - wholesale;

  const margin = retail > 0 ? ((profit / retail) * 100).toFixed(1) : "0.0";

  const totalInventory = product.variants.reduce(
    (total, variant) => total + variant.quantity,
    0,
  );

  const inventoryValue = wholesale * totalInventory;

  const potentialRevenue = retail * totalInventory;

  const stats = [
    {
      title: "Retail Price",
      value: `$${retail.toFixed(2)}`,
    },
    {
      title: "Wholesale Cost",
      value: `$${wholesale.toFixed(2)}`,
    },
    {
      title: "Profit Per Item",
      value: `$${profit.toFixed(2)}`,
      color: "text-green-600",
    },
    {
      title: "Profit Margin",
      value: `${margin}%`,
      color: "text-green-600",
    },
    {
      title: "Units In Stock",
      value: totalInventory,
    },
    {
      title: "Inventory Value",
      value: `$${inventoryValue.toFixed(2)}`,
      color: "text-blue-600",
    },
    {
      title: "Potential Revenue",
      value: `$${potentialRevenue.toFixed(2)}`,
      color: "text-indigo-600",
    },
    {
      title: "Variants",
      value: product.variants.length,
    },
  ];

  return (
    <section>
      <h2 className="mb-5 text-2xl font-bold">Product Overview</h2>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
              {stat.title}
            </p>

            <h3
              className={`mt-3 text-3xl font-bold ${
                stat.color || "text-gray-900"
              }`}
            >
              {stat.value}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductStats;

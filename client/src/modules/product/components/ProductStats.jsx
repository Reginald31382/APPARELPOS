const ProductStats = ({ product }) => {
  const retail = Number(product.price || 0);
  const wholesale = Number(product.cost || 0);
  const variants = product.variants || [];
  const TARGET_MARGIN = 30;

  const variantStats = variants.map((variant) => {
    const regularPrice = Number(variant.price ?? product.price ?? 0);
    const salePrice = Number(variant.salePrice ?? 0);

    const effectivePrice =
      salePrice > 0 && salePrice < regularPrice ? salePrice : regularPrice;

    const profit = effectivePrice - wholesale;
    const margin = effectivePrice > 0 ? (profit / effectivePrice) * 100 : 0;

    return { effectivePrice, profit, margin };
  });

  const minPrice = variantStats.length
    ? Math.min(...variantStats.map((item) => item.effectivePrice))
    : retail;

  const maxPrice = variantStats.length
    ? Math.max(...variantStats.map((item) => item.effectivePrice))
    : retail;

  const minProfit = variantStats.length
    ? Math.min(...variantStats.map((item) => item.profit))
    : retail - wholesale;

  const maxProfit = variantStats.length
    ? Math.max(...variantStats.map((item) => item.profit))
    : retail - wholesale;

  const minMargin = variantStats.length
    ? Math.min(...variantStats.map((item) => item.margin))
    : retail > 0
      ? ((retail - wholesale) / retail) * 100
      : 0;

  const maxMargin = variantStats.length
    ? Math.max(...variantStats.map((item) => item.margin))
    : minMargin;

  const marginTargetStatus =
    minMargin >= TARGET_MARGIN
      ? "All variants meet the 30% target"
      : maxMargin < TARGET_MARGIN
        ? "All variants are below 30%"
        : "Some variants are below 30%";

  const totalInventory = variants.reduce(
    (total, variant) => total + Number(variant.quantity || 0),
    0,
  );

  const inventoryValue = wholesale * totalInventory;

  const potentialRevenue = variants.reduce((total, variant) => {
    const regularPrice = Number(variant.price ?? product.price ?? 0);
    const salePrice = Number(variant.salePrice ?? 0);
    const effectivePrice =
      salePrice > 0 && salePrice < regularPrice ? salePrice : regularPrice;

    return total + effectivePrice * Number(variant.quantity || 0);
  }, 0);

  const formatRange = (min, max) =>
    min === max
      ? `$${min.toFixed(2)}`
      : `$${min.toFixed(2)} – $${max.toFixed(2)}`;

  const formatPercentRange = (min, max) =>
    min === max
      ? `${min.toFixed(1)}%`
      : `${min.toFixed(1)}% – ${max.toFixed(1)}%`;

  const stats = [
    {
      title: "Retail Price",
      value: formatRange(minPrice, maxPrice),
    },
    {
      title: "Wholesale Cost",
      value: `$${wholesale.toFixed(2)}`,
    },
    {
      title: "Profit Per Item",
      value: formatRange(minProfit, maxProfit),
      color: minProfit < 0 ? "text-red-600" : "text-green-600",
    },
    {
      title: "Profit Margin",
      value: formatPercentRange(minMargin, maxMargin),
      color: minMargin >= TARGET_MARGIN ? "text-green-600" : "text-amber-600",
      note: marginTargetStatus,
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
      value: variants.length,
    },
  ];

  return (
    <section>
      <h2 className="mb-5 text-2xl font-bold">Product Overview</h2>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="min-w-0 rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
              {stat.title}
            </p>

            <h3
              className={`mt-3 break-words text-2xl font-bold ${
                stat.color || "text-gray-900"
              }`}
            >
              {stat.value}
            </h3>
            {stat.note && (
              <p
                className={`mt-2 text-xs ${
                  minMargin >= TARGET_MARGIN
                    ? "text-green-600"
                    : "text-amber-600"
                }`}
              >
                {stat.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductStats;

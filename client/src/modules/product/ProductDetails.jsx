import { useParams } from "react-router-dom";
import useProduct from "../../hooks/useProduct";

const ProductDetails = () => {
  const { id } = useParams();

  const { data: product, isLoading } = useProduct(id);

  if (isLoading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!product) {
    return <p className="p-6">Product not found.</p>;
  }

  const totalStock = product.variants.reduce(
    (sum, variant) => sum + variant.quantity,
    0,
  );

  const profit = Number(product.price) - Number(product.cost || 0);

  const margin = product.price
    ? ((profit / Number(product.price)) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-8">
        <img
          src={
            product.images?.[0] || "https://placehold.co/300x300?text=No+Image"
          }
          className="h-72 w-72 rounded-2xl bg-[#f7f5f2] object-contain p-6"
        />

        <div className="flex-1">
          <h1 className="text-4xl font-bold">{product.name}</h1>

          <p className="mt-2 text-lg text-gray-500">
            {product.brand} • {product.category}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat title="Retail" value={`$${product.price}`} />
            <Stat title="Cost" value={`$${product.cost}`} />
            <Stat title="Profit" value={`$${profit}`} />
            <Stat title="Stock" value={totalStock} />
            <Stat title="Margin" value={`${margin}%`} />
          </div>
        </div>
      </div>

      <hr />

      <h2 className="text-2xl font-bold">Inventory</h2>

      <div className="overflow-hidden rounded-2xl border">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Color</th>
              <th className="p-4 text-left">Size</th>
              <th className="p-4 text-left">SKU</th>
              <th className="p-4 text-center">Stock</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {product.variants.map((variant) => (
              <tr key={variant.sku} className="border-t hover:bg-gray-50">
                <td className="p-4">{variant.color}</td>

                <td className="p-4">{variant.size}</td>

                <td className="p-4">{variant.sku}</td>

                <td className="p-4 text-center font-bold">
                  {variant.quantity}
                </td>

                <td className="p-4 text-center">
                  {variant.quantity === 0 ? (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                      Out
                    </span>
                  ) : variant.quantity <= 5 ? (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
                      Low
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                      In Stock
                    </span>
                  )}
                </td>

                <td className="p-4 text-center">
                  <button className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100">
                    Adjust
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <hr />

      <h2 className="text-2xl font-bold">Recent Inventory Activity</h2>

      <div className="rounded-2xl border bg-white p-6">Coming next...</div>
    </div>
  );
};

const Stat = ({ title, value }) => (
  <div className="rounded-xl bg-gray-50 p-4">
    <p className="text-sm text-gray-500">{title}</p>

    <p className="mt-1 text-2xl font-bold">{value}</p>
  </div>
);

export default ProductDetails;

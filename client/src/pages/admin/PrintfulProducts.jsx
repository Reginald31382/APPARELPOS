import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { fetchPrintfulProducts } from "../../services/printfulService";

const PrintfulProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const data = await fetchPrintfulProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load Printful products:", error);
        toast.error(
          error.response?.data?.message || "Unable to load Printful products.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Printful Products</h1>
        <p className="mt-1 text-gray-500">
          View products synced from your Printful store.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-10 text-center">
          Loading Printful products...
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <h2 className="text-xl font-semibold">No Printful products found</h2>
          <p className="mt-2 text-gray-500">
            Sync a product in Printful, then refresh this page.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-4 rounded-xl border bg-white p-5 sm:flex-row sm:items-center"
            >
              <div className="flex-1">
                <h2 className="font-semibold">{product.name}</h2>

                <p className="mt-1 text-sm text-gray-500">
                  Printful ID: {product.id}
                </p>

                <p className="text-sm text-gray-500">
                  {product.synced} of {product.variants} variants synced
                </p>
              </div>

              <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                Printful
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrintfulProducts;

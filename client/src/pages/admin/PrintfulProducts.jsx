import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  fetchPrintfulProducts,
  importPrintfulProduct,
} from "../../services/printfulService";

const PrintfulProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importingId, setImportingId] = useState(null);
  const [importedIds, setImportedIds] = useState([]);

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

  const handleImport = async (product) => {
    try {
      setImportingId(product.id);

      const result = await importPrintfulProduct(product.id);

      setImportedIds((current) => [...current, product.id]);

      toast.success(result.message || `${product.name} imported successfully.`);
    } catch (error) {
      if (error.response?.status === 409) {
        setImportedIds((current) =>
          current.includes(product.id) ? current : [...current, product.id],
        );

        toast.error("This product is already in ApparelPOS.");
      } else {
        console.error("Printful import failed:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Unable to import this product.",
        );
      }
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Printful Products</h1>
        <p className="mt-1 text-gray-500">
          Import synced Printful products into ApparelPOS.
        </p>
      </div>

      {loading ? (
        <p className="py-10 text-center text-gray-500">
          Loading Printful products...
        </p>
      ) : products.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center">
          <h2 className="font-semibold">No synced products found</h2>
          <p className="mt-2 text-sm text-gray-500">
            Sync a product in Printful before importing it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => {
            const isImported =
              product.imported || importedIds.includes(product.id);
            const isImporting = importingId === product.id;

            return (
              <div
                key={product.id}
                className="flex flex-col gap-4 rounded-xl border bg-white p-5 sm:flex-row sm:items-center"
              >
                {product.thumbnail_url && (
                  <img
                    src={product.thumbnail_url}
                    alt={product.name}
                    className="h-24 w-24 rounded-lg border object-contain"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold">{product.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Printful ID: {product.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product.synced} of {product.variants} variants synced
                  </p>
                  <p className="mt-2 text-sm font-medium">
                    {isImported ? "Imported" : "Ready to import"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleImport(product)}
                  disabled={isImported || isImporting}
                  className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isImporting
                    ? "Importing..."
                    : isImported
                      ? "Already Imported"
                      : "Import to ApparelPOS"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PrintfulProducts;

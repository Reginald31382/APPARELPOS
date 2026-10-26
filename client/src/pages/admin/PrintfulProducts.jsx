import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  fetchPrintfulProducts,
  importPrintfulProduct,
  deleteImportedPrintfulProduct,
} from "../../services/printfulService";

const PrintfulProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importingId, setImportingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [importedIds, setImportedIds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

  useEffect(() => {
    loadProducts();
  }, []);

  const handleImport = async (product) => {
    try {
      setImportingId(product.id);

      const result = await importPrintfulProduct(product.id);

      setImportedIds((current) =>
        current.includes(product.id) ? current : [...current, product.id],
      );

      setProducts((current) =>
        current.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, imported: true }
            : item,
        ),
      );

      toast.success(result.message || `${product.name} imported successfully.`);
    } catch (error) {
      if (error.response?.status === 409) {
        setImportedIds((current) =>
          current.includes(product.id) ? current : [...current, product.id],
        );

        setProducts((current) =>
          current.map((item) =>
            String(item.id) === String(product.id)
              ? { ...item, imported: true }
              : item,
          ),
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

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}" from ApparelPOS?\n\nThis removes the product from your ApparelPOS database only. It does not delete the product from Printful.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(product.id);

      const result = await deleteImportedPrintfulProduct(product.id);

      setImportedIds((current) =>
        current.filter((id) => String(id) !== String(product.id)),
      );

      setProducts((current) =>
        current.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, imported: false }
            : item,
        ),
      );

      toast.success(
        result.message || `${product.name} deleted from ApparelPOS.`,
      );
    } catch (error) {
      console.error("Printful product deletion failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Unable to delete this product from ApparelPOS.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      const data = await fetchPrintfulProducts();
      setProducts(data);

      setImportedIds(
        data.filter((product) => product.imported).map((product) => product.id),
      );

      toast.success("Printful products refreshed.");
    } catch (error) {
      console.error("Failed to refresh Printful products:", error);
      toast.error(
        error.response?.data?.message || "Unable to refresh Printful products.",
      );
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Printful Products</h1>
          <p className="mt-1 text-gray-500">
            Import synced Printful products into ApparelPOS.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={
            loading || refreshing || importingId !== null || deletingId !== null
          }
          className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {refreshing ? "Refreshing..." : "Refresh Products"}
        </button>
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
              product.imported ||
              importedIds.some((id) => String(id) === String(product.id));

            const isImporting = String(importingId) === String(product.id);
            const isDeleting = String(deletingId) === String(product.id);
            const isBusy = isImporting || isDeleting;

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

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleImport(product)}
                    disabled={isImported || isBusy}
                    className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isImporting
                      ? "Importing..."
                      : isImported
                        ? "Already Imported"
                        : "Import to ApparelPOS"}
                  </button>

                  {isImported && (
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      disabled={isBusy}
                      className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PrintfulProducts;

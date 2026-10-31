import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaQuestionCircle,
  FaSyncAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import {
  fetchPrintifyProducts,
  importPrintifyProduct,
  fetchPrintifyProductStatus,
} from "../../services/printifyService";

const PRODUCTS_PER_PAGE = 12;

const getProductImage = (product) => {
  const images = product.images || [];
  const defaultImage = images.find((image) => image.is_default);

  return defaultImage?.src || images[0]?.src || product.thumbnail_url || "";
};

const getPublishStatus = (product) => {
  if (typeof product.published === "boolean") {
    return product.published ? "Published" : "Unpublished";
  }

  if (product.publishStatus) {
    return product.publishStatus;
  }

  return "Unknown";
};

const PublishStatus = ({ status }) => {
  const statusConfig = {
    Published: {
      className: "bg-green-100 text-green-700",
      icon: <FaCheckCircle />,
    },
    Unpublished: {
      className: "bg-red-100 text-red-700",
      icon: <FaExclamationCircle />,
    },
    Unknown: {
      className: "bg-gray-100 text-gray-600",
      icon: <FaQuestionCircle />,
    },
  };

  const config = statusConfig[status] || statusConfig.Unknown;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.icon}
      {status}
    </span>
  );
};

const PrintifyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importingId, setImportingId] = useState(null);
  const [checkingId, setCheckingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, products.length);

  const currentProducts = products.slice(startIndex, endIndex);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await fetchPrintifyProducts();

      setProducts(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to load Printify products:", error);

      toast.error(
        error.response?.data?.message || "Unable to load Printify products.",
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

      const result = await importPrintifyProduct(product.id);

      setProducts((current) =>
        current.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, imported: true }
            : item,
        ),
      );

      toast.success(
        result.message ||
          `${product.title || product.name} imported successfully.`,
      );
    } catch (error) {
      if (error.response?.status === 409) {
        setProducts((current) =>
          current.map((item) =>
            String(item.id) === String(product.id)
              ? { ...item, imported: true }
              : item,
          ),
        );

        toast.error("This product is already in ApparelPOS.");
      } else {
        console.error("Printify import failed:", error);

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

  const handleCheckStatus = async (product) => {
    try {
      setCheckingId(product.id);

      const result = await fetchPrintifyProductStatus(product.id);

      setProducts((current) =>
        current.map((item) =>
          String(item.id) === String(product.id)
            ? {
                ...item,
                published: result.published,
                publishStatus: result.status,
              }
            : item,
        ),
      );

      if (result.published === true) {
        toast.success(`${product.title || product.name} is published.`);
      } else if (result.published === false) {
        toast.error(`${product.title || product.name} is unpublished.`);
      } else {
        toast("Printify did not return a publishing status.");
      }
    } catch (error) {
      console.error("Printify status check failed:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to verify Printify publishing status.",
      );
    } finally {
      setCheckingId(null);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      const data = await fetchPrintifyProducts();

      setProducts(Array.isArray(data) ? data : []);
      setCurrentPage(1);

      toast.success("Printify products refreshed.");
    } catch (error) {
      console.error("Failed to refresh Printify products:", error);

      toast.error(
        error.response?.data?.message || "Unable to refresh Printify products.",
      );
    } finally {
      setRefreshing(false);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Display a compact range of page numbers.
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    return pages;
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {startIndex + 1}–{endIndex}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">{products.length}</span>{" "}
          products
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaChevronLeft />
            Previous
          </button>

          {currentPage > 3 && totalPages > 5 && (
            <>
              <button
                type="button"
                onClick={() => goToPage(1)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
              >
                1
              </button>
              <span className="px-1 text-gray-400">...</span>
            </>
          )}

          {getPageNumbers().map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`min-w-10 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                currentPage === page
                  ? "border-black bg-black text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages - 2 && totalPages > 5 && (
            <>
              <span className="px-1 text-gray-400">...</span>
              <button
                type="button"
                onClick={() => goToPage(totalPages)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <FaChevronRight />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Printify Products</h1>

          <p className="mt-1 text-gray-500">
            Manage imported products and verify their Printify publishing
            status.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={
            loading || refreshing || importingId !== null || checkingId !== null
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh Products"}
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="py-10 text-center text-gray-500">
          Loading Printify products...
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="rounded-xl border bg-white p-8 text-center">
          <h2 className="font-semibold">No Printify products found</h2>

          <p className="mt-2 text-sm text-gray-500">
            Make sure your Printify shop is connected and contains products.
          </p>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-5 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "Try Again"}
          </button>
        </div>
      ) : (
        <>
          {/* Product Count */}
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <p className="text-sm font-medium text-gray-600">
              {products.length} Printify{" "}
              {products.length === 1 ? "product" : "products"} found
            </p>

            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages || 1}
            </p>
          </div>

          {/* Product List */}
          <div className="space-y-4">
            {currentProducts.map((product) => {
              const productName =
                product.title || product.name || "Untitled Product";

              const image = getProductImage(product);
              const variants = product.variants || [];

              const enabledVariants = variants.filter(
                (variant) =>
                  variant.is_enabled === true && variant.is_available !== false,
              );

              const isImported = Boolean(product.imported);
              const isImporting = String(importingId) === String(product.id);
              const isChecking = String(checkingId) === String(product.id);

              const isBusy = importingId !== null || checkingId !== null;

              const publishStatus = getPublishStatus(product);

              return (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 rounded-xl border bg-white p-5 transition hover:border-gray-400 hover:shadow-sm sm:flex-row sm:items-center"
                >
                  {/* Product Image */}
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-gray-50">
                    {image ? (
                      <img
                        src={image}
                        alt={productName}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="px-2 text-center text-xs text-gray-400">
                        No Image
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-gray-900">
                      {productName}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Printify ID: {product.id}
                    </p>

                    <p className="text-sm text-gray-500">
                      {enabledVariants.length} enabled and available variants
                    </p>

                    <p className="text-sm text-gray-500">
                      {variants.length} total variants
                    </p>

                    {/* Import Status */}
                    <p
                      className={`mt-2 text-sm font-medium ${
                        isImported ? "text-green-700" : "text-gray-700"
                      }`}
                    >
                      {isImported
                        ? "Imported into ApparelPOS"
                        : "Ready to import"}
                    </p>

                    {/* Printify Publishing Status */}
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Printify Status:
                        </span>

                        <PublishStatus status={publishStatus} />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCheckStatus(product)}
                        disabled={isBusy}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 transition hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FaSyncAlt
                          className={isChecking ? "animate-spin" : ""}
                        />
                        {isChecking ? "Checking..." : "Check Status"}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleImport(product)}
                      disabled={
                        isImported || isBusy || enabledVariants.length === 0
                      }
                      className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isImporting
                        ? "Importing..."
                        : isImported
                          ? "Already Imported"
                          : enabledVariants.length === 0
                            ? "No Available Variants"
                            : "Import to ApparelPOS"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <Pagination />
        </>
      )}
    </div>
  );
};

export default PrintifyProducts;

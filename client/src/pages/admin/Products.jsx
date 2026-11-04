import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ProductModal from "../../components/product/ProductModal";
import { fetchProducts, deleteProduct } from "../../services/productService";

const ITEMS_PER_PAGE = 10;

const getProductPricing = (product) => {
  const variants = product.variants || [];
  const productCost = Number(product.cost || 0);

  const prices = variants.map((variant) => {
    const regularPrice = Number(variant.price ?? product.price ?? 0);
    const salePrice = Number(variant.salePrice ?? 0);

    const effectivePrice =
      salePrice > 0 && salePrice < regularPrice ? salePrice : regularPrice;

    return {
      regularPrice,
      effectivePrice,
      salePrice: salePrice > 0 && salePrice < regularPrice ? salePrice : null,
      profit: effectivePrice - productCost,
    };
  });

  // Handle products that don't have variants.
  if (prices.length === 0) {
    const regularPrice = Number(product.price || 0);
    const salePrice = Number(product.salePrice || 0);

    const effectivePrice =
      salePrice > 0 && salePrice < regularPrice ? salePrice : regularPrice;

    return {
      minPrice: effectivePrice,
      maxPrice: effectivePrice,
      minProfit: effectivePrice - productCost,
      maxProfit: effectivePrice - productCost,
      hasVariantPriceOverride: false,
      hasSale: salePrice > 0 && salePrice < regularPrice,
    };
  }

  const effectivePrices = prices.map((item) => item.effectivePrice);
  const profits = prices.map((item) => item.profit);

  return {
    minPrice: Math.min(...effectivePrices),
    maxPrice: Math.max(...effectivePrices),
    minProfit: Math.min(...profits),
    maxProfit: Math.max(...profits),

    hasVariantPriceOverride: variants.some(
      (variant) =>
        variant.price !== null &&
        variant.price !== undefined &&
        Number(variant.price) !== Number(product.price),
    ),

    hasSale: prices.some((item) => item.salePrice !== null),
  };
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await fetchProducts({ status: "all" });

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load products:", error);
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [products, currentPage]);

  // Keep the current page valid if products are deleted or removed.
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await deleteProduct(product._id);
      await loadProducts();

      toast.success("Product deleted.");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to delete product.");
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatPriceRange = (min, max) =>
    min === max
      ? `$${min.toFixed(2)}`
      : `$${min.toFixed(2)} – $${max.toFixed(2)}`;

  return (
    <>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Products</h1>

            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              Manage your product catalog.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddProduct}
            className="w-full rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 sm:w-auto sm:text-base"
          >
            + Add Product
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border bg-white p-6 text-center shadow-sm sm:p-10">
            <h2 className="text-xl font-semibold">No products yet</h2>

            <p className="mt-2 text-sm text-gray-500">
              Start building your catalog by adding your first product.
            </p>

            <button
              type="button"
              onClick={handleAddProduct}
              className="mt-6 w-full rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 sm:w-auto"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Product Cards */}
            {paginatedProducts.map((product) => {
              const totalStock = (product.variants || []).reduce(
                (sum, variant) => sum + Number(variant.quantity || 0),
                0,
              );

              const pricing = getProductPricing(product);

              return (
                <div
                  key={product._id}
                  onClick={() => navigate(`/admin/products/${product._id}`)}
                  className="cursor-pointer rounded-xl border bg-white transition hover:border-gray-400 hover:shadow-md"
                >
                  <div className="p-4 sm:p-5">
                    {/* Product Header */}
                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                      <img
                        src={
                          product.images?.[0] ||
                          "https://placehold.co/100x100?text=No+Image"
                        }
                        alt={product.name}
                        className="h-20 w-20 shrink-0 rounded-lg bg-[#f7f5f2] object-contain p-2 sm:h-24 sm:w-24"
                      />

                      <div className="min-w-0 flex-1">
                        <h2 className="break-words text-base font-semibold text-gray-900 sm:text-lg">
                          {product.name}
                        </h2>

                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                          {product.brand || "No Brand"} •{" "}
                          {product.category || "Uncategorized"}
                        </p>

                        <div className="mt-2">
                          {product.active ? (
                            <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                              Active
                            </span>
                          ) : (
                            <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                              Hidden
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Product Information Grid */}
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                      {/* Retail */}
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">Retail</p>

                        <p className="mt-1 break-words text-sm font-semibold text-gray-900">
                          {formatPriceRange(pricing.minPrice, pricing.maxPrice)}
                        </p>

                        {pricing.hasSale && (
                          <p className="mt-1 text-xs text-red-600">
                            Sale price active
                          </p>
                        )}

                        {pricing.hasVariantPriceOverride && (
                          <p className="mt-1 text-xs text-blue-600">
                            Variant override
                          </p>
                        )}
                      </div>

                      {/* Cost */}
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">Cost</p>

                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          ${Number(product.cost || 0).toFixed(2)}
                        </p>
                      </div>

                      {/* Profit */}
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">Profit</p>

                        <p
                          className={`mt-1 break-words text-sm font-semibold ${
                            pricing.minProfit < 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {formatPriceRange(
                            pricing.minProfit,
                            pricing.maxProfit,
                          )}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Before fees
                        </p>
                      </div>

                      {/* Stock */}
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">Stock</p>

                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {totalStock}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">Status</p>

                        <p
                          className={`mt-1 text-sm font-semibold ${
                            product.active ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {product.active ? "Active" : "Hidden"}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div
                      className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleEditProduct(product)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:w-auto sm:py-2"
                      >
                        Edit Product
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product)}
                        className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 sm:w-auto sm:py-2"
                      >
                        Delete Product
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col gap-4 rounded-xl border bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-center text-sm text-gray-500 sm:text-left">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                  </span>
                  {" – "}
                  <span className="font-semibold text-gray-900">
                    {Math.min(currentPage * ITEMS_PER_PAGE, products.length)}
                  </span>
                  {" of "}
                  <span className="font-semibold text-gray-900">
                    {products.length}
                  </span>{" "}
                  products
                </p>

                <div className="flex items-center justify-between gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-4"
                  >
                    Previous
                  </button>

                  <span className="whitespace-nowrap px-2 text-xs text-gray-600 sm:text-sm">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-4"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {totalPages <= 1 && products.length > 0 && (
              <p className="px-2 text-right text-sm text-gray-500">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        onProductCreated={loadProducts}
      />
    </>
  );
};

export default Products;

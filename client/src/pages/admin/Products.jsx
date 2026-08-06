import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ProductModal from "../../components/product/ProductModal";
import { fetchProducts, deleteProduct } from "../../services/productService";
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await fetchProducts();

      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

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

  const navigate = useNavigate();

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>

            <p className="mt-1 text-gray-500">Manage your product catalog.</p>
          </div>

          <button
            onClick={handleAddProduct}
            className="rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            + Add Product
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold">No products yet</h2>

            <p className="mt-2 text-gray-500">
              Start building your catalog by adding your first product.
            </p>

            <button
              onClick={handleAddProduct}
              className="mt-6 rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => {
              const totalStock = product.variants.reduce(
                (sum, variant) => sum + variant.quantity,
                0,
              );

              const profit = Number(product.price) - Number(product.cost || 0);

              return (
                <div
                  key={product._id}
                  onClick={() => navigate(`/admin/products/${product._id}`)}
                  className="cursor-pointer rounded-xl border bg-white transition hover:border-black hover:shadow-md"
                >
                  <div className="flex items-center gap-5 p-5">
                    {/* Image */}
                    <img
                      src={
                        product.images?.[0] ||
                        "https://placehold.co/100x100?text=No+Image"
                      }
                      alt={product.name}
                      className="h-20 w-20 rounded-lg bg-[#f7f5f2] object-contain p-2"
                    />

                    {/* Product */}
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-lg font-semibold">
                        {product.name}
                      </h2>

                      <p className="text-sm text-gray-500">
                        {product.brand || "No Brand"} •{" "}
                        {product.category || "Uncategorized"}
                      </p>
                    </div>

                    {/* Retail */}
                    <div className="hidden w-24 text-center md:block">
                      <p className="text-xs text-gray-500">Retail</p>

                      <p className="font-semibold">
                        ${Number(product.price).toFixed(2)}
                      </p>
                    </div>

                    {/* Cost */}
                    <div className="hidden w-24 text-center lg:block">
                      <p className="text-xs text-gray-500">Cost</p>

                      <p>${Number(product.cost || 0).toFixed(2)}</p>
                    </div>

                    {/* Profit */}
                    <div className="hidden w-24 text-center lg:block">
                      <p className="text-xs text-gray-500">Profit</p>

                      <p className="font-semibold text-green-600">
                        ${profit.toFixed(2)}
                      </p>
                    </div>

                    {/* Stock */}
                    <div className="w-24 text-center">
                      <p className="text-xs text-gray-500">Stock</p>

                      <p className="font-semibold">{totalStock}</p>
                    </div>

                    {/* Status */}
                    <div className="w-24 text-center">
                      {product.active ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                          Hidden
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div
                      className="flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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

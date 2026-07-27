import { useEffect, useState } from "react";
import ProductModal from "../../components/product/ProductModal";
import { fetchProducts } from "../../services/productService";

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

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

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
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
              >
                <div className="flex h-72 items-center justify-center bg-gray-100 p-6">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="space-y-2 p-5">
                  <h2 className="text-xl font-semibold">{product.name}</h2>

                  <p className="text-gray-500">{product.brand}</p>

                  <p className="font-bold">${product.price.toFixed(2)}</p>

                  <p className="text-sm text-gray-500">
                    {product.variants.length} Variant(s)
                  </p>

                  <button
                    onClick={() => handleEditProduct(product)}
                    className="mt-4 w-full rounded-xl border border-gray-300 px-4 py-2 font-medium transition hover:bg-gray-100"
                  >
                    Edit Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </>
  );
};

export default Products;

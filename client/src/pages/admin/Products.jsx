import { useEffect, useState } from "react";
import ProductModal from "../../components/product/ProductModal";
import { getProducts } from "../../services/productService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

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

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>

            <p className="mt-1 text-gray-500">Manage your product catalog.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
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
              onClick={() => setIsModalOpen(true)}
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
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="h-64 w-full object-cover"
                />

                <div className="space-y-2 p-5">
                  <h2 className="text-xl font-semibold">{product.name}</h2>

                  <p className="text-gray-500">{product.brand}</p>

                  <p className="font-bold">${product.price.toFixed(2)}</p>

                  <p className="text-sm text-gray-500">
                    {product.variants.length} Variant(s)
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Products;

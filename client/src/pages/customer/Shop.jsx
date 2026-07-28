import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProducts } from "../../services/productService";
import { formatCurrency } from "../../utils/currency";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();

        setProducts(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-center text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-4xl font-bold">Shop Responsibly</h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg"
          >
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover"
            />

            <div className="space-y-2 p-4">
              <h2 className="line-clamp-2 text-lg font-semibold">
                {product.name}
              </h2>

              <p className="text-sm text-gray-500">{product.brand}</p>

              <p className="text-xl font-bold">
                {formatCurrency(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Shop;

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProducts } from "../../services/productService";
import { formatCurrency } from "../../utils/currency";
import RatingBadge from "@/modules/reviews/components/RatingBadge";

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="mb-6 text-3xl font-bold sm:mb-8 sm:text-4xl">
        Shop Responsibly
      </h1>

      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="group overflow-hidden rounded-2xl border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="space-y-2 p-4">
              <h2 className="line-clamp-2 min-h-[48px] text-sm font-semibold sm:text-base">
                {product.name}
              </h2>

              <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                {product.brand}
              </p>
              <RatingBadge productId={product._id} />
              <p className="pt-1 text-lg font-bold">
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

import ProductCard from "./ProductCard";
import useProducts from "../../hooks/useProducts";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const ProductGrid = () => {
  const { data: products = [], isLoading } = useProducts();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
      <LoadingSpinner text="Loading products..." />
    </div>
  );
};

export default ProductGrid;

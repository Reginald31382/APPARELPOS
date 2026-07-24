import ProductCard from "./ProductCard";
import useProducts from "../../hooks/useProducts";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const ProductGrid = ({
  CardComponent = ProductCard,
  filters = {},
  className = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
}) => {
  const { data: products = [], isLoading } = useProducts(filters);

  if (isLoading) {
    return <LoadingSpinner text="Loading products..." />;
  }

  return (
    <div className={className}>
      {products.map((product) => (
        <CardComponent key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;

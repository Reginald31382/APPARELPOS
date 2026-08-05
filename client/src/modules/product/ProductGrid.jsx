import ProductCard from "./ProductCard";
import useProducts from "../../hooks/useProducts";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const ProductGrid = ({
  CardComponent = ProductCard,
  filters = {},
  className = "grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4",
}) => {
  const { data: products = [], isLoading } = useProducts(filters);

  const productList = Array.isArray(products) ? products : [];

  if (isLoading) {
    return <LoadingSpinner text="Loading products..." />;
  }

  return (
    <div className={className}>
      {productList.map((product) => (
        <CardComponent key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;

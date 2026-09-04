import StoreProductCard from "./StoreProductCard";
import useProducts from "../../hooks/useProducts";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const ProductGrid = ({
  CardComponent = StoreProductCard,
  filters = {},
  emptyMessage = "No products found.",
  className = "grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4",
}) => {
  const { data: products = [], isLoading } = useProducts(filters);

  const productList = Array.isArray(products) ? products : [];

  if (!isLoading && productList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        {/* <h2 className="text-3xl font-bold">{emptyMessage}</h2> */}

        <p className="mt-4 max-w-md text-gray-500">
          Check back soon for new arrivals.
        </p>
      </div>
    );
  }

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

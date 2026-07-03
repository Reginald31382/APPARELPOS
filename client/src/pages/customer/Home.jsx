import ProductGrid from "../../components/product/ProductGrid";
import useProducts from "../../hooks/useProducts";

const Home = () => {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading)
    return <div className="p-10 text-center">Loading products...</div>;

  if (error)
    return (
      <div className="p-10 text-center text-red-500">
        Error loading products
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl p-8">
      <h1 className="mb-6 text-4xl font-bold">J.Rome Apparel POS</h1>

      <ProductGrid products={products} />
    </div>
  );
};

export default Home;

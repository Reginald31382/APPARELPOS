import ProductGrid from "../../components/product/ProductGrid";
import useProducts from "../../hooks/useProducts";
import useFilterStore from "../../store/useFilterStore";

const Home = () => {
  const { search, category, brand, featured } = useFilterStore();

  const { data: products, isLoading } = useProducts({
    search,
    category,
    brand,
    featured,
  });

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="text-3xl font-bold mb-4">J.Rome POS</h1>

      <ProductGrid products={products || []} />
    </div>
  );
};

export default Home;

import ProductGrid from "../../components/product/ProductGrid";
import ProductQuickView from "../../components/product/ProductQuickView";
import SearchBar from "../../components/product/SearchBar";
import FilterBar from "../../components/product/FilterBar";

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
    <div className="max-w-7xl mx-auto p-4">
      {/* POS CONTROLS */}
      <SearchBar />
      <FilterBar />

      {/* PRODUCT GRID */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ProductGrid products={products || []} />
      )}

      {/* GLOBAL DRAWER */}
      <ProductQuickView />
    </div>
  );
};

export default Home;

import { useParams } from "react-router-dom";

import useProduct from "../../../hooks/useProduct";
import useInventoryHistoryByProduct from "../hooks/useInventoryHistoryByProduct";

import ProductHero from "../components/ProductHero";
import ProductStats from "../components/ProductStats";
import InventoryGrid from "../components/InventoryGrid";
import InventoryHistory from "../components/InventoryHistory";

const ProductDetails = () => {
  const { id } = useParams();

  const { data: product, isLoading, refetch } = useProduct(id);

  const { data: history = [] } = useInventoryHistoryByProduct(id);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-gray-500">Loading Product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 p-8">
      <ProductHero product={product} />

      <ProductStats product={product} />

      <InventoryGrid product={product} refetch={refetch} />

      <InventoryHistory history={history} />
    </div>
  );
};

export default ProductDetails;

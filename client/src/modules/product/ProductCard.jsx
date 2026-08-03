import useProductStore from "../../store/product/useProductStore";
import InventoryBadge from "../inventory/components/InventoryBadge";
import { getTotalInventory } from "../inventory/utils/inventoryHelpers";

import { formatCurrency } from "../../utils/currency";
import RatingBadge from "../reviews/components/RatingBadge";

const ProductCard = ({ product }) => {
  const openProduct = useProductStore((state) => state.openProduct);

  return (
    <div
      onClick={() => openProduct(product)}
      className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition"
    >
      <img
        src={product.images?.[0]}
        className="h-40 w-full object-cover rounded"
      />
      <h2 className="mt-2 font-semibold">{product.name}</h2>
      <RatingBadge productId={product._id} />
      <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>

      <InventoryBadge quantity={getTotalInventory(product.variants)} />
    </div>
  );
};

export default ProductCard;

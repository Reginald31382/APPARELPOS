import useProductStore from "../../store/product/useProductStore";
import InventoryBadge from "../inventory/components/InventoryBadge";
import { getTotalInventory } from "../inventory/utils/inventoryHelpers";
import RatingBadge from "../reviews/components/RatingBadge";
import { formatCurrency } from "../../utils/currency";

const ProductCard = ({ product }) => {
  const openProduct = useProductStore((state) => state.openProduct);

  return (
    <div
      onClick={() => openProduct(product)}
      className="group cursor-pointer overflow-hidden rounded-2xl border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="space-y-2 p-4">
        <h2 className="line-clamp-2 min-h-[48px] text-base font-semibold">
          {product.name}
        </h2>

        <RatingBadge productId={product._id} />

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">
            {formatCurrency(product.price)}
          </span>

          <InventoryBadge quantity={getTotalInventory(product.variants)} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

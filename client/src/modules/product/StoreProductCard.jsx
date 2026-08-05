import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/currency";

const StoreProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="group flex h-full flex-col">
      <div className="relative overflow-hidden rounded-xl bg-[#f7f5f2]">
        <div className="relative aspect-[4/5] overflow-hidden">
          {/* Primary Image */}
          <img
            src={product.images?.[0]}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
              product.images?.length > 1
                ? "group-hover:scale-105 group-hover:opacity-0"
                : "group-hover:scale-105"
            }`}
          />

          {/* Secondary Image */}
          {product.images?.length > 1 && (
            <img
              src={product.images[1]}
              alt={product.name}
              className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100"
            />
          )}
        </div>

        <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/5" />
      </div>

      <div className="flex flex-1 flex-col justify-between py-3">
        <div>
          <h3 className="line-clamp-2 min-h-[48px] text-sm font-semibold text-black sm:text-base">
            {product.name}
          </h3>

          {product.brand && (
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-gray-400 sm:text-xs">
              {product.brand}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold">
            {formatCurrency(product.price)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default StoreProductCard;

import useProductStore from "../../store/product/useProductStore";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/currency";

const StoreProductCard = ({ product }) => {
  const openProduct = useProductStore((state) => state.openProduct);
  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="relative overflow-hidden bg-[#f7f5f2]">
        <div className="relative aspect-[4/5] overflow-hidden">
          {/* Primary Image */}
          <img
            src={product.images?.[0]}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
              product.images?.length > 1
                ? "group-hover:opacity-0 group-hover:scale-105"
                : ""
            }`}
          />

          {/* Secondary Image */}
          {product.images?.length > 1 && (
            <img
              src={product.images[1]}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
            />
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10" />

        {/* Quick View */}
        <div className="absolute bottom-5 left-1/2 w-[85%] -translate-x-1/2 translate-y-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openProduct(product);
            }}
            className="w-full bg-white py-3 text-sm font-semibold uppercase tracking-widest text-black transition hover:bg-black hover:text-white"
          >
            Quick View
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium tracking-wide text-black">
            {product.name}
          </h3>

          {product.brand && (
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-400">
              {product.brand}
            </p>
          )}
        </div>

        <p className="text-base font-medium">{formatCurrency(product.price)}</p>
      </div>
    </Link>
  );
};

export default StoreProductCard;

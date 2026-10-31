import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/currency";

const getVariantPrice = (variant, productPrice) => {
  const regularPrice = Number(variant.price ?? productPrice ?? 0);
  const salePrice = Number(variant.salePrice ?? 0);

  return salePrice > 0 && salePrice < regularPrice ? salePrice : regularPrice;
};

const StoreProductCard = ({ product }) => {
  const variants = product.variants || [];

  const prices =
    variants.length > 0
      ? variants.map((variant) => getVariantPrice(variant, product.price))
      : [Number(product.price || 0)];

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const hasPriceRange = minPrice !== maxPrice;

  const regularPrices =
    variants.length > 0
      ? variants.map((variant) => Number(variant.price ?? product.price ?? 0))
      : [Number(product.price || 0)];

  const minRegularPrice = Math.min(...regularPrices);
  const hasSale = minPrice < minRegularPrice;

  return (
    <Link to={`/product/${product._id}`} className="group flex h-full flex-col">
      <div className="relative overflow-hidden rounded-xl bg-[#f7f5f2]">
        <div className="relative aspect-[4/5] overflow-hidden">
          {/* Primary Image */}
          <img
            src={product.images?.[0]}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              product.images?.length > 1
                ? "opacity-100 group-hover:opacity-0"
                : "opacity-100"
            }`}
          />

          {/* Secondary Image */}
          {product.images?.length > 1 && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          {/* Sold Out Overlay */}
          {product.soldOut && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/45">
              <span className="border border-white/70 px-5 py-3 text-center text-xs font-medium uppercase tracking-[0.25em] text-white">
                Sold Out
              </span>
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/5" />
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
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-lg font-bold">
              {hasPriceRange
                ? `From ${formatCurrency(minPrice)}`
                : formatCurrency(minPrice)}
            </span>

            {hasSale && (
              <span className="text-sm text-gray-400 line-through">
                {hasPriceRange
                  ? `From ${formatCurrency(minRegularPrice)}`
                  : formatCurrency(minRegularPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StoreProductCard;

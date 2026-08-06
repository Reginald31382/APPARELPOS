import { BadgeCheck, Star } from "lucide-react";

const ProductHero = ({ product }) => {
  const image =
    product.images?.[0] || "https://placehold.co/500x600?text=No+Image";

  return (
    <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
      <div className="grid lg:grid-cols-[340px_1fr]">
        {/* Product Image */}
        <div className="flex items-center justify-center bg-[#f8f6f2] p-8">
          <img
            src={image}
            alt={product.name}
            className="max-h-80 w-full object-contain"
          />
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-center p-8">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-bold">{product.name}</h1>

            {product.active && (
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                <BadgeCheck size={16} />
                Active
              </span>
            )}

            {product.featured && (
              <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                <Star size={16} />
                Featured
              </span>
            )}
          </div>

          <p className="mt-3 text-lg text-gray-500">
            {product.brand || "No Brand"}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
              {product.category || "Uncategorized"}
            </span>

            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
              {product.gender}
            </span>

            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
              {product.variants.length} Variant
              {product.variants.length !== 1 && "s"}
            </span>
          </div>

          {product.description && (
            <div className="mt-8 max-w-3xl">
              <h2 className="mb-2 font-semibold">Description</h2>

              <p className="leading-7 text-gray-600">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductHero;

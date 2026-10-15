import { useState } from "react";
import { toast } from "react-hot-toast";
import { updateProduct } from "../../services/productService";

const VariantPricing = ({ product, refetch }) => {
  const [prices, setPrices] = useState({});
  const [savingSku, setSavingSku] = useState(null);

  const handleChange = (sku, field, value) => {
    setPrices((prev) => ({
      ...prev,
      [sku]: {
        ...(prev[sku] || {}),
        [field]: value,
      },
    }));
  };

  const handleSave = async (variant) => {
    const values = prices[variant.sku] || {};

    const regularPrice =
      values.price !== undefined ? values.price : (variant.price ?? "");

    const salePrice =
      values.salePrice !== undefined
        ? values.salePrice
        : (variant.salePrice ?? "");

    if (
      regularPrice === "" ||
      !Number.isFinite(Number(regularPrice)) ||
      Number(regularPrice) <= 0
    ) {
      toast.error("Enter a regular price greater than zero.");
      return;
    }

    if (
      salePrice !== "" &&
      (!Number.isFinite(Number(salePrice)) ||
        Number(salePrice) <= 0 ||
        Number(salePrice) >= Number(regularPrice))
    ) {
      toast.error(
        "Sale price must be greater than zero and lower than regular price.",
      );
      return;
    }

    try {
      setSavingSku(variant.sku);

      const updatedVariants = product.variants.map((item) =>
        item.sku === variant.sku
          ? {
              ...item,
              price: Number(regularPrice),
              salePrice: salePrice === "" ? null : Number(salePrice),
            }
          : item,
      );

      await updateProduct(product._id, {
        ...product,
        variants: updatedVariants,
      });

      toast.success(`Pricing saved for ${variant.color} / ${variant.size}.`);

      setPrices((prev) => {
        const next = { ...prev };
        delete next[variant.sku];
        return next;
      });

      await refetch();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save variant pricing.",
      );
    } finally {
      setSavingSku(null);
    }
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Variant Pricing</h2>
        <p className="mt-1 text-gray-500">
          Set a regular and optional sale price for each size and color.
        </p>
      </div>

      {product.variants.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-center text-gray-500">
          No variants available.
        </div>
      ) : (
        <div className="space-y-4">
          {product.variants.map((variant) => {
            const values = prices[variant.sku] || {};

            return (
              <div
                key={variant.sku}
                className="grid gap-4 rounded-2xl border bg-white p-5 md:grid-cols-5 md:items-end"
              >
                <div>
                  <p className="font-semibold">
                    {variant.color} / {variant.size}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    SKU: {variant.sku}
                  </p>
                </div>

                <label className="block text-sm font-medium">
                  Regular Price ($)
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={
                      values.price !== undefined
                        ? values.price
                        : (variant.price ?? product.price ?? "")
                    }
                    onChange={(e) =>
                      handleChange(variant.sku, "price", e.target.value)
                    }
                    className="mt-2 w-full rounded-lg border p-3"
                  />
                </label>

                <label className="block text-sm font-medium">
                  Sale Price ($)
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="No sale"
                    value={
                      values.salePrice !== undefined
                        ? values.salePrice
                        : (variant.salePrice ?? "")
                    }
                    onChange={(e) =>
                      handleChange(variant.sku, "salePrice", e.target.value)
                    }
                    className="mt-2 w-full rounded-lg border p-3"
                  />
                </label>

                <div className="text-sm text-gray-600">
                  Effective price
                  <p className="mt-2 text-xl font-bold text-gray-900">
                    $
                    {Number(
                      (values.salePrice !== undefined
                        ? values.salePrice
                        : variant.salePrice) ||
                        (values.price !== undefined
                          ? values.price
                          : (variant.price ?? product.price ?? 0)),
                    ).toFixed(2)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSave(variant)}
                  disabled={savingSku === variant.sku}
                  className="rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {savingSku === variant.sku ? "Saving..." : "Save Price"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default VariantPricing;

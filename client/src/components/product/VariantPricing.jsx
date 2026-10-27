import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { updateProduct } from "../../services/productService";

const VariantPricing = ({ product, refetch }) => {
  const [variants, setVariants] = useState(product.variants || []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setVariants(product.variants || []);
  }, [product]);

  const handleChange = (index, field, value) => {
    setVariants((current) =>
      current.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant,
      ),
    );
  };

  const handleSaveAll = async () => {
    for (const variant of variants) {
      const price = Number(variant.price ?? product.price);
      const salePrice =
        variant.salePrice === "" || variant.salePrice == null
          ? null
          : Number(variant.salePrice);
      const quantity = Number(variant.quantity);

      if (!Number.isFinite(price) || price <= 0) {
        toast.error(`Enter a valid regular price for SKU ${variant.sku}.`);
        return;
      }

      if (
        salePrice !== null &&
        (!Number.isFinite(salePrice) || salePrice <= 0 || salePrice >= price)
      ) {
        toast.error(
          `Sale price for SKU ${variant.sku} must be lower than its regular price.`,
        );
        return;
      }

      if (
        product.fulfillmentType !== "PrintOnDemand" &&
        (!Number.isInteger(quantity) || quantity < 0)
      ) {
        toast.error(
          `Inventory for SKU ${variant.sku} must be a non-negative whole number.`,
        );
        return;
      }

      if (!String(variant.color ?? "").trim()) {
        toast.error(`Enter a variant option name for SKU ${variant.sku}.`);
        return;
      }
    }

    try {
      setSaving(true);

      const updatedVariants = variants.map((variant) => ({
        ...variant,
        color: String(variant.color ?? "").trim(),
        size: String(variant.size ?? "").trim(),
        price: Number(variant.price ?? product.price),
        salePrice:
          variant.salePrice === "" || variant.salePrice == null
            ? null
            : Number(variant.salePrice),
        ...(product.fulfillmentType !== "PrintOnDemand"
          ? { quantity: Number(variant.quantity) }
          : {}),
      }));

      await updateProduct(product._id, {
        ...product,
        variants: updatedVariants,
      });

      toast.success("All variant changes saved.");
      await refetch();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save variant changes.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!variants.length) {
    return (
      <section className="rounded-xl border border-dashed p-6 text-center text-gray-500">
        No variants available.
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Variant Editor</h2>
          <p className="mt-1 text-gray-500">
            Edit option names, pricing, and inventory across multiple variants.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving Changes..." : "Save All Changes"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Color / Option</th>
              <th className="p-4">Size / Model</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Regular Price ($)</th>
              <th className="p-4">Sale Price ($)</th>
              <th className="p-4">Inventory</th>
            </tr>
          </thead>

          <tbody>
            {variants.map((variant, index) => (
              <tr key={variant.sku || index} className="border-t align-middle">
                <td className="p-3">
                  <input
                    aria-label={`Option name for ${variant.sku}`}
                    value={variant.color ?? ""}
                    onChange={(event) =>
                      handleChange(index, "color", event.target.value)
                    }
                    className="w-40 rounded-lg border p-2"
                  />
                </td>

                <td className="p-3">
                  <input
                    aria-label={`Size or model for ${variant.sku}`}
                    value={variant.size ?? ""}
                    onChange={(event) =>
                      handleChange(index, "size", event.target.value)
                    }
                    placeholder="None"
                    className="w-32 rounded-lg border p-2"
                  />
                </td>

                <td className="p-3 font-mono text-xs text-gray-500">
                  {variant.sku || "—"}
                </td>

                <td className="p-3">
                  <input
                    aria-label={`Regular price for ${variant.sku}`}
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={variant.price ?? product.price ?? ""}
                    onChange={(event) =>
                      handleChange(index, "price", event.target.value)
                    }
                    className="w-32 rounded-lg border p-2"
                  />
                </td>

                <td className="p-3">
                  <input
                    aria-label={`Sale price for ${variant.sku}`}
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="No sale"
                    value={variant.salePrice ?? ""}
                    onChange={(event) =>
                      handleChange(index, "salePrice", event.target.value)
                    }
                    className="w-32 rounded-lg border p-2"
                  />
                </td>

                <td className="p-3">
                  {product.fulfillmentType === "PrintOnDemand" ? (
                    <span className="text-gray-500">Made to order</span>
                  ) : (
                    <input
                      aria-label={`Inventory for ${variant.sku}`}
                      type="number"
                      min="0"
                      step="1"
                      value={variant.quantity ?? 0}
                      onChange={(event) =>
                        handleChange(index, "quantity", event.target.value)
                      }
                      className="w-24 rounded-lg border p-2"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-500">
        SKUs and supplier variant IDs are preserved. For Printful products,
        inventory remains managed separately from your made-to-order variants.
      </p>
    </section>
  );
};

export default VariantPricing;

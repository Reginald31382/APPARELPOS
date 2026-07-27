import { useState } from "react";
import { X } from "lucide-react";
import { createProduct } from "../../services/productService";

const initialProduct = {
  name: "",
  description: "",
  brand: "",
  category: "",
  gender: "Unisex",

  price: "",
  salePrice: "",
  cost: "",
  weight: "",

  featured: false,
  active: true,

  images: [],
  variants: [],
};

const ProductModal = ({ isOpen, onClose, onProductCreated }) => {
  const [product, setProduct] = useState(initialProduct);
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const emptyVariant = {
    color: "",
    size: "",
    quantity: 0,
    sku: "",
    barcode: "",
  };

  const [variant, setVariant] = useState(emptyVariant);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addImage = () => {
    const url = imageUrl.trim();

    if (!url) return;

    if (product.images.includes(url)) {
      return;
    }

    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));

    setImageUrl("");
    setVariant(emptyVariant);
  };

  const removeImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;

    setVariant((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const addVariant = () => {
    if (!variant.color || !variant.size || !variant.sku) {
      return;
    }

    setProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, variant],
    }));

    setVariant(emptyVariant);
  };

  const removeVariant = (index) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleSaveProduct = async () => {
    if (!product.name.trim()) {
      alert("Product name is required.");
      return;
    }

    if (product.price === "") {
      alert("Price is required.");
      return;
    }

    if (product.weight === "") {
      alert("Weight is required.");
      return;
    }

    if (product.variants.length === 0) {
      alert("Please add at least one variant.");
      return;
    }

    try {
      setSaving(true);

      await createProduct({
        ...product,
        price: Number(product.price),
        salePrice: Number(product.salePrice || 0),
        cost: Number(product.cost || 0),
        weight: Number(product.weight),
      });

      handleClose();

      if (onProductCreated) {
        onProductCreated();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setProduct(initialProduct);
    setImageUrl("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold">Add Product</h2>
            <p className="text-sm text-gray-500">
              Create a new product for your catalog.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* ===================== */}
            {/* Basic Information */}
            {/* ===================== */}
            <section className="space-y-4">
              <h3 className="border-b pb-2 text-lg font-semibold">
                Basic Information
              </h3>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  rows={5}
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  placeholder="Product Description"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Brand</label>

                <input
                  type="text"
                  name="brand"
                  value={product.brand}
                  onChange={handleChange}
                  placeholder="J.rome"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                >
                  <option value="">Select Category</option>
                  <option value="Shirts">Shirts</option>
                  <option value="Hoodies">Hoodies</option>
                  <option value="Sweatshirts">Sweatshirts</option>
                  <option value="Pants">Pants</option>
                  <option value="Shorts">Shorts</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Gender</label>

                <select
                  name="gender"
                  value={product.gender}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            </section>

            {/* ===================== */}
            {/* Pricing & Shipping */}
            {/* ===================== */}
            <section className="space-y-6">
              <div>
                <h3 className="border-b pb-2 text-lg font-semibold">Pricing</h3>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Price
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full rounded-lg border p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Sale Price
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      name="salePrice"
                      value={product.salePrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full rounded-lg border p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Cost
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      name="cost"
                      value={product.cost}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full rounded-lg border p-3"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="border-b pb-2 text-lg font-semibold">
                  Shipping
                </h3>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium">
                    Weight (lb)
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="weight"
                    value={product.weight}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full rounded-lg border p-3"
                  />
                </div>
              </div>

              <div>
                <h3 className="border-b pb-2 text-lg font-semibold">
                  Visibility
                </h3>

                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={product.featured}
                      onChange={handleChange}
                    />
                    Featured Product
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="active"
                      checked={product.active}
                      onChange={handleChange}
                    />
                    Active Product
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* Future Sections */}
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <section className="space-y-4 rounded-xl border p-6">
              <h3 className="text-lg font-semibold">Product Images</h3>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste a Postimages Direct Link..."
                  className="flex-1 rounded-lg border p-3"
                />

                <button
                  type="button"
                  onClick={addImage}
                  className="rounded-lg bg-black px-5 text-white transition hover:bg-gray-800"
                >
                  Add
                </button>
              </div>

              {product.images.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
                  No product images added yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-xl border bg-white shadow-sm"
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="h-40 w-full object-cover"
                      />

                      <div className="space-y-3 p-3">
                        <p className="truncate text-xs text-gray-500">
                          {image}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="w-full rounded-lg bg-red-600 py-2 text-sm text-white transition hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-4 rounded-xl border p-6">
              <h3 className="text-lg font-semibold">Product Variants</h3>

              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="text"
                  name="color"
                  value={variant.color}
                  onChange={handleVariantChange}
                  placeholder="Color"
                  className="rounded-lg border p-3"
                />

                <input
                  type="text"
                  name="size"
                  value={variant.size}
                  onChange={handleVariantChange}
                  placeholder="Size"
                  className="rounded-lg border p-3"
                />

                <input
                  type="number"
                  name="quantity"
                  value={variant.quantity}
                  onChange={handleVariantChange}
                  placeholder="Quantity"
                  className="rounded-lg border p-3"
                />

                <input
                  type="text"
                  name="sku"
                  value={variant.sku}
                  onChange={handleVariantChange}
                  placeholder="SKU"
                  className="rounded-lg border p-3"
                />

                <input
                  type="text"
                  name="barcode"
                  value={variant.barcode}
                  onChange={handleVariantChange}
                  placeholder="Barcode (optional)"
                  className="rounded-lg border p-3 md:col-span-2"
                />
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="rounded-lg bg-black px-5 py-2 text-white transition hover:bg-gray-800"
              >
                + Add Variant
              </button>

              {product.variants.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-gray-500">
                  No variants added yet.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left">Color</th>
                        <th className="px-4 py-3 text-left">Size</th>
                        <th className="px-4 py-3 text-left">Qty</th>
                        <th className="px-4 py-3 text-left">SKU</th>
                        <th className="px-4 py-3 text-left">Barcode</th>
                        <th className="px-4 py-3 text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {product.variants.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-3">{item.color}</td>
                          <td className="px-4 py-3">{item.size}</td>
                          <td className="px-4 py-3">{item.quantity}</td>
                          <td className="px-4 py-3">{item.sku}</td>
                          <td className="px-4 py-3">{item.barcode || "-"}</td>

                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => removeVariant(index)}
                              className="rounded bg-red-600 px-3 py-1 text-white transition hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={handleClose}
            className="rounded-lg border px-5 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveProduct}
            disabled={saving}
            className="rounded-lg bg-black px-5 py-2 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

import { useState, useEffect } from "react";
import useCartStore from "../../store/cart/useCartStore";
import useProductStore from "../../store/product/useProductStore";

import { formatCurrency } from "../../utils/currency";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { notifySuccess, notifyError } from "../../utils/notifications";

const ProductQuickView = () => {
  const { isOpen, selectedProduct, closeProduct } = useProductStore();

  const addItem = useCartStore((state) => state.addItem);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // Reset selections when product changes
  useEffect(() => {
    if (selectedProduct) {
      setSelectedColor(null);
      setSelectedSize(null);
      setSelectedImage(0);
    }
  }, [selectedProduct]);

  const variants = selectedProduct?.variants || [];

  const colors = [...new Set(variants.map((v) => v.color))];

  const colorStock = colors.map((color) => ({
    color,
    hasStock: variants.some((v) => v.color === color && v.quantity > 0),
  }));

  const availableSizes = [
    ...new Set(
      variants
        .filter((v) => {
          if (!selectedColor) return true;
          return v.color === selectedColor;
        })
        .map((v) => v.size),
    ),
  ];

  const selectedVariant = variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize,
  );

  // ✅ SAFE GUARD (NO HOOKS AFTER THIS)
  if (!selectedProduct) return null;

  return (
    <Sheet open={isOpen} onOpenChange={closeProduct}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-6">
        <SheetHeader>
          <SheetTitle>{selectedProduct.name}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <img
              src={selectedProduct.images?.[selectedImage]}
              alt={selectedProduct.name}
              className="aspect-[4/5] w-full rounded-lg object-cover transition-all duration-300"
            />

            {selectedProduct.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {selectedProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded border-2 transition ${
                      selectedImage === index
                        ? "border-black"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-20 w-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="text-gray-600">{selectedProduct.description}</p>

          <p className="text-2xl font-bold">
            {formatCurrency(selectedProduct.price)}
          </p>

          {/* COLOR */}
          <div>
            <h3 className="mb-2 font-semibold">Color</h3>

            <div className="flex flex-wrap gap-2">
              {colorStock.map((item) => (
                <button
                  key={item.color}
                  disabled={!item.hasStock}
                  onClick={() => {
                    setSelectedColor(item.color);
                    setSelectedSize(null);
                  }}
                  className={`rounded border px-3 py-2 transition
                    ${
                      selectedColor === item.color
                        ? "bg-black text-white"
                        : "bg-white"
                    }
                    ${
                      !item.hasStock
                        ? "cursor-not-allowed opacity-40"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  {item.color}
                </button>
              ))}
            </div>
          </div>

          {/* SIZE */}
          <div>
            <h3 className="mb-2 font-semibold">Size</h3>

            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded border px-3 py-2 transition
                    ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "bg-white hover:bg-gray-100"
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* STOCK */}
          <div>
            {selectedVariant ? (
              <p
                className={`font-medium ${
                  selectedVariant.quantity > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {selectedVariant.quantity > 0
                  ? `${selectedVariant.quantity} in stock`
                  : "Out of Stock"}
              </p>
            ) : (
              <p className="text-gray-500">Select a color and size</p>
            )}
          </div>

          {/* ADD TO CART */}
          <button
            disabled={!selectedVariant || selectedVariant.quantity <= 0}
            onClick={() => {
              addItem({
                productId: selectedProduct._id,
                sku: selectedVariant.sku,
                image: selectedProduct.images[0],
                name: selectedProduct.name,
                color: selectedVariant.color,
                size: selectedVariant.size,
                unitPrice: selectedProduct.price,
                stock: selectedVariant.quantity,
              });
              notifySuccess("Added to cart");
              closeProduct();
            }}
            className="w-full rounded bg-black py-3 text-white transition disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductQuickView;

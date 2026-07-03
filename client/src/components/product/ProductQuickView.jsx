import { useState, useEffect } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import useProductStore from "../../store/useProductStore";

const ProductQuickView = () => {
  const { isOpen, selectedProduct, closeProduct } = useProductStore();

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Reset selections whenever a different product is opened
  useEffect(() => {
    if (selectedProduct) {
      setSelectedColor(null);
      setSelectedSize(null);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const variants = selectedProduct.variants || [];

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

  return (
    <Sheet open={isOpen} onOpenChange={closeProduct}>
      <SheetContent className="w-[450px] overflow-y-auto p-6">
        <SheetHeader>
          <SheetTitle>{selectedProduct.name}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <img
            src={selectedProduct.images?.[0]}
            alt={selectedProduct.name}
            className="w-full rounded-lg"
          />

          <p className="text-gray-600">{selectedProduct.description}</p>

          <p className="text-2xl font-bold">${selectedProduct.price}</p>

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
            className="w-full rounded bg-black py-3 text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductQuickView;

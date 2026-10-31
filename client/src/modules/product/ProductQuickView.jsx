import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import useCustomerCartStore from "../../store/cart/useCustomerCartStore";
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

  const addItem = useCustomerCartStore((state) => state.addItem);

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

  const sanitizedDescription = DOMPurify.sanitize(
    selectedProduct?.description || "",
    { USE_PROFILES: { html: true } },
  );

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

          <div
            className="
    product-description
    text-sm leading-7 text-gray-600
    [&_p]:mb-4
    [&_p:last-child]:mb-0
    [&_ul]:mb-4
    [&_ul]:list-disc
    [&_ul]:pl-6
    [&_ol]:mb-4
    [&_ol]:list-decimal
    [&_ol]:pl-6
    [&_li]:mb-1
    [&_strong]:font-semibold
    [&_strong]:text-gray-900
    [&_b]:font-semibold
    [&_h2]:mb-3
    [&_h2]:mt-5
    [&_h2]:text-base
    [&_h2]:font-semibold
    [&_h3]:mb-2
    [&_h3]:mt-4
    [&_h3]:font-semibold
    [&_a]:text-black
    [&_a]:underline
  "
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />

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

          {/* PRODUCT AVAILABILITY / STOCK */}
          <div>
            {selectedProduct.soldOut ? (
              <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
                Currently Unavailable
              </p>
            ) : selectedVariant ? (
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
          {selectedProduct.soldOut ? (
            <button
              disabled
              className="w-full rounded border border-gray-300 bg-gray-100 py-3 text-sm font-medium uppercase tracking-wider text-gray-500 cursor-not-allowed"
            >
              Currently Unavailable
            </button>
          ) : (
            <button
              disabled={!selectedVariant || selectedVariant.quantity <= 0}
              onClick={() => {
                const added = addItem({
                  productId: selectedProduct._id,
                  soldOut: selectedProduct.soldOut,
                  sku: selectedVariant.sku,
                  image: selectedProduct.images?.[0],
                  name: selectedProduct.name,
                  color: selectedVariant.color,
                  size: selectedVariant.size,
                  unitPrice: selectedProduct.price,
                  stock: selectedVariant.quantity,
                  fulfillmentType: selectedProduct.fulfillmentType,
                  supplier: selectedProduct.supplier,
                  supplierVariantId: selectedVariant.supplierVariantId,
                });

                if (!added) return;

                notifySuccess("Added to cart");
                closeProduct();
              }}
              className="w-full rounded bg-black py-3 text-white transition disabled:opacity-50"
            >
              Add to Cart
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductQuickView;

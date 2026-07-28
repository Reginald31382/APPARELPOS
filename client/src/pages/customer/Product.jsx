import ProductImageLightbox from "../../components/product/ProductImageLightbox";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import useCustomerCartStore from "../../store/cart/useCustomerCartStore";
import useProduct from "../../hooks/useProduct";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const purchaseSectionRef = useRef(null);
  const [showStickyCart, setShowStickyCart] = useState(false);
  const addItem = useCustomerCartStore((state) => state.addItem);
  const { data: product, isLoading, isError } = useProduct(id);

  useEffect(() => {
    if (product?.images?.length && !selectedImage) {
      setSelectedImage(product.images[0]);
    }
  }, [product, selectedImage]);

  useEffect(() => {
    if (!product?.variants?.length) return;

    const firstVariantForColor = product.variants.find(
      (variant) => variant.color === selectedColor,
    );

    if (firstVariantForColor) {
      setSelectedSize(firstVariantForColor.size);
    }
  }, [selectedColor, product]);

  useEffect(() => {
    const handleScroll = () => {
      if (!purchaseSectionRef.current) return;

      const rect = purchaseSectionRef.current.getBoundingClientRect();

      setShowStickyCart(rect.bottom < 0);
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">Loading product...</div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">Product not found.</div>
    );
  }

  const colors = [...new Set(product.variants.map((v) => v.color))];

  const sizes = product.variants.filter(
    (variant) => variant.color === selectedColor,
  );

  const selectedVariant = product.variants.find(
    (variant) =>
      variant.color === selectedColor && variant.size === selectedSize,
  );

  const handleAddToCart = () => {
    console.log("Add to Cart clicked");
    console.log("Selected Variant:", selectedVariant);

    if (!selectedVariant) {
      console.log("No variant selected");
      return;
    }

    addItem({
      _id: product._id,
      sku: selectedVariant.sku,
      name: product.name,
      image: selectedImage,
      brand: product.brand,
      color: selectedColor,
      size: selectedSize,
      stock: selectedVariant.quantity,
      unitPrice: product.price,
      quantity,
    });

    navigate("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="grid grid-cols-[90px_1fr] gap-5">
          {/* Thumbnails */}
          <div className="flex flex-col gap-3">
            {product.images?.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`overflow-hidden rounded-lg border-2 transition ${
                  selectedImage === image
                    ? "border-black"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={image}
                  alt={product.name}
                  className="w-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="overflow-hidden rounded-xl bg-gray-100">
            <img
              src={selectedImage || product.images?.[0]}
              alt={product.name}
              onClick={() => setIsLightboxOpen(true)}
              className="w-full object-cover transition duration-500 hover:scale-110 cursor-zoom-in"
            />
          </div>
        </div>

        {/* Product Info */}
        <div ref={purchaseSectionRef} className="space-y-8">
          <div>
            <p className="uppercase tracking-[0.25em] text-sm text-gray-500">
              {product.brand}
            </p>

            <h1 className="text-4xl font-bold mt-2">{product.name}</h1>

            <p className="text-3xl font-semibold mt-4">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Color */}
          <div>
            <h3 className="font-semibold mb-3">Color</h3>

            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded-md transition ${
                    selectedColor === color
                      ? "bg-black text-white border-black"
                      : "border-gray-300 hover:border-black"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <h3 className="font-semibold mb-3">Size</h3>

            <div className="flex flex-wrap gap-3">
              {sizes.map((variant) => (
                <button
                  key={variant.sku}
                  onClick={() => setSelectedSize(variant.size)}
                  className={`px-4 py-2 border rounded-md transition ${
                    selectedSize === variant.size
                      ? "bg-black text-white border-black"
                      : "border-gray-300 hover:border-black"
                  }`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>

          {selectedVariant && (
            <p className="text-sm text-gray-500">
              {selectedVariant.quantity > 0
                ? `${selectedVariant.quantity} in stock`
                : "Out of stock"}
            </p>
          )}

          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-3">Quantity</h3>

            <div className="flex items-center border rounded-md w-fit">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3"
              >
                <Minus size={18} />
              </button>

              <span className="w-12 text-center">{quantity}</span>

              <button
                onClick={() =>
                  setQuantity((q) =>
                    selectedVariant
                      ? Math.min(selectedVariant.quantity, q + 1)
                      : q,
                  )
                }
                className="p-3"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <button
            disabled={!selectedVariant || selectedVariant.quantity === 0}
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-4 rounded-md font-semibold transition hover:bg-neutral-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {selectedVariant?.quantity ? "Add to Cart" : "Out of Stock"}
          </button>

          {product.description && (
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">Description</h3>

              <p className="text-gray-600 leading-7">{product.description}</p>
            </div>
          )}
        </div>
      </div>
      <ProductImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={product.images}
        selectedImage={selectedImage}
        onSelect={setSelectedImage}
      />
      {showStickyCart && selectedVariant && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-4 shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">
                {selectedColor} / {selectedSize}
              </p>

              <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
            </div>

            <button
              disabled={selectedVariant.quantity === 0}
              onClick={handleAddToCart}
              className="rounded-md bg-black px-6 py-3 font-semibold text-white disabled:bg-gray-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;

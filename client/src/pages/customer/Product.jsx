import DOMPurify from "dompurify";
import ProductImageLightbox from "../../components/product/ProductImageLightbox";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Minus, Plus } from "lucide-react";

import SEO from "../../components/SEO";
import StructuredData from "../../components/StructuredData";

import useCustomerCartStore from "../../store/cart/useCustomerCartStore";
import useProduct from "../../hooks/useProduct";

const getVariantPricing = (variant, productPrice) => {
  const regularPrice = Number(variant?.price ?? productPrice ?? 0);
  const salePrice = Number(variant?.salePrice ?? 0);

  const effectivePrice =
    salePrice > 0 && salePrice < regularPrice ? salePrice : regularPrice;

  return {
    regularPrice,
    salePrice: salePrice > 0 && salePrice < regularPrice ? salePrice : null,
    effectivePrice,
  };
};

const getRecommendationPricing = (product) => {
  const variants = product?.variants || [];

  const prices = variants.map((variant) => {
    const regularPrice = Number(variant.price ?? product.price ?? 0);
    const salePrice = Number(variant.salePrice ?? 0);

    const validSalePrice =
      salePrice > 0 && salePrice < regularPrice ? salePrice : null;

    return {
      regularPrice,
      salePrice: validSalePrice,
      effectivePrice: validSalePrice ?? regularPrice,
    };
  });

  if (prices.length === 0) {
    return getVariantPricing(null, product?.price);
  }

  return prices.reduce((lowest, current) =>
    current.effectivePrice < lowest.effectivePrice ? current : lowest,
  );
};

const normalizeColor = (color) =>
  (color || "Default").trim().replace(/\s+/g, " ");

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

  // Reset selections when product changes
  useEffect(() => {
    setSelectedImage("");
    setSelectedColor("");
    setSelectedSize("");
    setQuantity(1);
  }, [id]);

  useEffect(() => {
    if (product?.images?.length && !selectedImage) {
      setSelectedImage(product.images[0]);
    }
  }, [product, selectedImage]);

  useEffect(() => {
    if (!product?.variants?.length) return;

    const availableColors = [
      ...new Set(
        product.variants.map((variant) => normalizeColor(variant.color)),
      ),
    ];

    setSelectedColor((current) =>
      availableColors.includes(current) ? current : availableColors[0],
    );

    setSelectedSize("");
  }, [product]);

  useEffect(() => {
    if (!product?.variants?.length || !selectedColor) return;

    const variantsForColor = product.variants.filter(
      (variant) => normalizeColor(variant.color) === selectedColor,
    );

    const availableSizes = [
      ...new Set(
        variantsForColor
          .map((variant) => String(variant.size || "").trim())
          .filter(
            (size) =>
              size && !["one size", "default"].includes(size.toLowerCase()),
          ),
      ),
    ];

    setSelectedSize((current) => {
      if (availableSizes.includes(current)) return current;
      return availableSizes[0] || variantsForColor[0]?.size || "";
    });
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

  const productDescription =
    product.description || `Shop ${product.name} from J.Rome Studios.`;

  const sanitizedDescription = DOMPurify.sanitize(product.description || "", {
    USE_PROFILES: { html: true },
  });

  const productUrl = `https://www.jrome-studios.com/product/${product._id}`;

  const primaryVariant = product.variants?.[0];

  const isPrintOnDemand = product.fulfillmentType === "PrintOnDemand";

  // A sold-out product cannot be purchased, regardless of fulfillment type.
  const canPurchase = (variant) =>
    !product.soldOut &&
    Boolean(variant) &&
    (isPrintOnDemand || variant.quantity > 0);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: (product.images || []).map((image) =>
      image.startsWith("http")
        ? image
        : `https://www.jrome-studios.com${image}`,
    ),
    description: productDescription,
    sku: primaryVariant?.sku || product._id,
    brand: {
      "@type": "Brand",
      name: product.brand || "J.Rome Studios",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability: product.soldOut
        ? "https://schema.org/OutOfStock"
        : product.fulfillmentType === "PrintOnDemand" ||
            product.variants?.some((variant) => variant.quantity > 0)
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "J.Rome Studios",
      },
    },
  };

  const variants = product.variants || [];

  const colors = [
    ...new Set(variants.map((variant) => normalizeColor(variant.color))),
  ];

  const hasColorOptions = colors.length > 1;

  const variantsForColor = variants.filter(
    (variant) => normalizeColor(variant.color) === selectedColor,
  );

  const sizeOptions = [
    ...new Set(
      variantsForColor
        .map((variant) => String(variant.size || "").trim())
        .filter(
          (size) =>
            size && !["one size", "default"].includes(size.toLowerCase()),
        ),
    ),
  ];

  const hasSizeOptions = sizeOptions.length > 1;

  const selectedVariant = variantsForColor.find((variant) =>
    hasSizeOptions ? String(variant.size || "").trim() === selectedSize : true,
  );

  const selectedPricing = getVariantPricing(selectedVariant, product.price);

  const handleAddToCart = () => {
    if (!canPurchase(selectedVariant)) {
      return;
    }

    addItem({
      _id: product._id,
      productId: product._id,
      soldOut: product.soldOut,
      sku: selectedVariant.sku,
      name: product.name,

      image: selectedImage,
      images: product.images || [],

      brand: product.brand,
      weight: product.weight,
      color: selectedColor,
      size: selectedSize,
      stock: selectedVariant.quantity,
      unitPrice: selectedPricing.effectivePrice,
      quantity,
      fulfillmentType: product.fulfillmentType,
      supplier: product.supplier,
      supplierVariantId: selectedVariant.supplierVariantId,
    });

    // Do not navigate if the cart rejected the item.
    const cartItems = useCustomerCartStore.getState().items;
    const addedItem = cartItems.find(
      (item) => item.sku === selectedVariant.sku,
    );

    if (addedItem) {
      navigate("/cart");
    }
  };

  return (
    <>
      <SEO
        title={product.name}
        description={productDescription}
        path={`/product/${product._id}`}
        image={product.images?.[0]}
      />

      <StructuredData data={productSchema} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Images */}
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-[90px_minmax(0,1fr)] sm:gap-5">
            {/* Main Product Image */}
            <div className="relative order-1 aspect-[4/5] w-full self-start overflow-hidden rounded-xl bg-gray-100 sm:order-2">
              <img
                src={selectedImage || product.images?.[0]}
                alt={product.name}
                loading="eager"
                draggable={false}
                onClick={() => setIsLightboxOpen(true)}
                onError={(e) => {
                  console.error(
                    "Product image failed to load:",
                    e.currentTarget.src,
                  );
                }}
                className="h-full w-full cursor-zoom-in object-contain"
              />

              {/* Sold Out Overlay */}
              {product.soldOut && (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/40">
                  <span className="border border-white/70 px-5 py-3 text-center text-xs font-medium uppercase tracking-[0.25em] text-white">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="order-2 flex max-w-full gap-3 overflow-x-auto pb-2 sm:order-1 sm:max-h-[700px] sm:flex-col sm:overflow-x-hidden sm:overflow-y-auto sm:pr-1 sm:pb-0">
              {product.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`w-20 shrink-0 overflow-hidden rounded-lg border-2 transition sm:w-full ${
                    selectedImage === image
                      ? "border-black"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div ref={purchaseSectionRef} className="space-y-8">
            <div>
              <p className="uppercase tracking-[0.25em] text-sm text-gray-500">
                {product.brand}
              </p>

              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                {product.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-baseline gap-3 sm:mt-4">
                <p className="text-2xl font-semibold sm:text-3xl">
                  ${selectedPricing.effectivePrice.toFixed(2)}
                </p>

                {selectedPricing.salePrice !== null && (
                  <p className="text-lg text-gray-400 line-through">
                    ${selectedPricing.regularPrice.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {/* Color */}
            {hasColorOptions && (
              <div>
                <h3 className="mb-3 font-semibold">Color</h3>

                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`min-w-[70px] rounded-lg border px-4 py-3 transition ${
                        selectedColor === color
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-black"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {hasSizeOptions && (
              <div>
                <h3 className="mb-3 font-semibold">Size / Model</h3>

                <div className="flex flex-wrap gap-3">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[56px] rounded-lg border px-4 py-3 transition ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product Availability */}
            {product.soldOut ? (
              <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
                Sold Out
              </p>
            ) : selectedVariant ? (
              <p className="text-sm text-gray-500">
                {isPrintOnDemand
                  ? "Made to order"
                  : selectedVariant.quantity > 0
                    ? `${selectedVariant.quantity} in stock`
                    : "Out of stock"}
              </p>
            ) : null}

            {/* Quantity */}
            {!product.soldOut && (
              <div>
                <h3 className="font-semibold mb-3">Quantity</h3>

                <div className="flex w-fit items-center rounded-lg border">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-4 active:bg-gray-100"
                  >
                    <Minus size={18} />
                  </button>

                  <span className="w-12 text-center">{quantity}</span>

                  <button
                    onClick={() =>
                      setQuantity((q) =>
                        selectedVariant &&
                        (isPrintOnDemand || q < selectedVariant.quantity)
                          ? q + 1
                          : q,
                      )
                    }
                    className="p-4 active:bg-gray-100"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button
              disabled={!canPurchase(selectedVariant)}
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-4 rounded-md font-semibold transition hover:bg-neutral-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {product.soldOut
                ? "Sold Out"
                : selectedVariant
                  ? "Add to Cart"
                  : "Choose Color"}
            </button>

            {/* Description */}
            {product.description && (
              <div className="border-t pt-6">
                <h3 className="mb-4 text-lg font-semibold tracking-tight">
                  Product Description
                </h3>

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
                  dangerouslySetInnerHTML={{
                    __html: sanitizedDescription,
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Recommended Products */}
        {product.recommendedProduct && (
          <section className="mt-12 border-t pt-10">
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl">
              What Most People Buy With This Product
            </h2>

            {(() => {
              const recommended = product.recommendedProduct;
              const pricing = getRecommendationPricing(recommended);
              const image = recommended.images?.[0];

              return (
                <div className="flex flex-col gap-5 rounded-2xl border p-4 sm:flex-row sm:items-center sm:p-6">
                  <button
                    type="button"
                    onClick={() => navigate(`/product/${recommended._id}`)}
                    className="block w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-48"
                    aria-label={`View ${recommended.name}`}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={recommended.name}
                        loading="lazy"
                        className="aspect-square w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-square items-center justify-center text-sm text-gray-500">
                        No image available
                      </div>
                    )}
                  </button>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">
                      {recommended.name}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-baseline gap-3">
                      <p className="text-xl font-bold">
                        {recommended.variants?.length ? "From " : ""}$
                        {pricing.effectivePrice.toFixed(2)}
                      </p>

                      {pricing.salePrice !== null && (
                        <p className="text-base text-gray-400 line-through">
                          ${pricing.regularPrice.toFixed(2)}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/product/${recommended._id}`)}
                      className="mt-5 rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-neutral-800"
                    >
                      View Product
                    </button>
                  </div>
                </div>
              );
            })()}
          </section>
        )}

        <ProductImageLightbox
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          images={product.images}
          selectedImage={selectedImage}
          onSelect={setSelectedImage}
        />

        {/* Mobile Sticky Cart */}
        {showStickyCart && selectedVariant && (
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-4 shadow-lg lg:hidden">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  {[
                    hasColorOptions ? selectedColor : "",
                    hasSizeOptions ? selectedSize : "",
                  ]
                    .filter(Boolean)
                    .join(" / ") || "Standard option"}
                </p>

                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold">
                    ${selectedPricing.effectivePrice.toFixed(2)}
                  </p>

                  {selectedPricing.salePrice !== null && (
                    <p className="text-sm text-gray-400 line-through">
                      ${selectedPricing.regularPrice.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              <button
                disabled={!canPurchase(selectedVariant)}
                onClick={handleAddToCart}
                className="rounded-lg bg-black px-8 py-4 font-semibold text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {product.soldOut ? "Unavailable" : "Add to Cart"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Product;

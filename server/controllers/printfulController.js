import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/Products.js";
import {
  getPrintfulProducts,
  getPrintfulProductDetails,
  getPrintfulVariantCost,
} from "../services/printfulService.js";

// GET /api/printful/products
export const getProducts = asyncHandler(async (req, res) => {
  const data = await getPrintfulProducts();

  res.status(200).json({
    success: true,
    products: data.result || [],
  });
});

// GET /api/printful/products/:id/details
export const getProductDetails = asyncHandler(async (req, res) => {
  const details = await getPrintfulProductDetails(req.params.id);

  res.status(200).json({
    success: true,
    details,
  });
});

// POST /api/printful/products/:id/import
export const importProduct = asyncHandler(async (req, res) => {
  const printfulProductId = String(req.params.id);

  const existingProduct = await Product.findOne({
    "supplier.name": "Printful",
    "supplier.productId": printfulProductId,
  });

  if (existingProduct) {
    return res.status(409).json({
      message: "This Printful product has already been imported.",
      product: existingProduct,
    });
  }

  const details = await getPrintfulProductDetails(printfulProductId);
  const syncProduct = details?.sync_product;
  const syncVariants = details?.sync_variants || [];

  if (!syncProduct || syncVariants.length === 0) {
    return res.status(400).json({
      message: "Printful product has no synced variants to import.",
    });
  }

  const variants = await Promise.all(
    syncVariants.map(async (variant) => {
      const parts = (variant.name || "").split("/").map((part) => part.trim());

      const color = parts.length > 1 ? parts[0] : "Default";
      const size =
        parts.length > 1 ? parts.slice(1).join(" / ") : parts[0] || "One Size";

      const cost = await getPrintfulVariantCost(variant.variant_id);

      if (!Number.isFinite(cost) || cost <= 0) {
        throw new Error(
          `Invalid Printful cost for variant ${variant.variant_id}.`,
        );
      }

      // Target 30% gross margin; round UP to a .99 retail price.
      const minimumPrice = cost / 0.7;
      const retailPrice = Math.ceil(minimumPrice + 0.01) - 0.01;

      return {
        color,
        size,
        quantity: 0,
        sku: `PF-${variant.id}`,
        supplierVariantId: String(variant.id),
        supplierSku: variant.sku || "",
        barcode: "",
        cost: Number(cost.toFixed(2)),
        price: Number(retailPrice.toFixed(2)),
        salePrice: null,
      };
    }),
  );

  const product = await Product.create({
    name: syncProduct.name,
    description: "",
    brand: "J.Rome",
    category: "Apparel",
    gender: "Unisex",
    price: variants[0].price,
    salePrice: 0,
    cost: variants[0].cost,
    weight: 0,
    images: syncProduct.thumbnail_url ? [syncProduct.thumbnail_url] : [],
    variants,
    fulfillmentType: "PrintOnDemand",
    supplier: {
      name: "Printful",
      productId: printfulProductId,
      syncEnabled: true,
    },
    featured: false,
    active: true,
  });

  res.status(201).json({
    message: "Printful product imported successfully.",
    product,
  });
});

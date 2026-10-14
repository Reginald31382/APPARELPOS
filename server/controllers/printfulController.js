import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/Products.js";
import {
  getPrintfulProducts,
  getPrintfulProductDetails,
} from "../services/printfulService.js";

// GET /api/printful/products
// Retrieve products synced to your Printful store.
export const getProducts = asyncHandler(async (req, res) => {
  const data = await getPrintfulProducts();

  res.status(200).json({
    success: true,
    products: data.result || [],
  });
});

// GET /api/printful/products/:id/details
// Retrieve full details for a Printful product before importing it.
export const getProductDetails = asyncHandler(async (req, res) => {
  const details = await getPrintfulProductDetails(req.params.id);

  console.log("Printful product details:", JSON.stringify(details, null, 2));

  res.status(200).json({
    success: true,
    details,
  });
});

// POST /api/printful/products/:id/import
// Import a Printful product into the ApparelPOS catalog.
export const importProduct = asyncHandler(async (req, res) => {
  const printfulProductId = String(req.params.id);

  // Prevent importing the same Printful product twice.
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

  const variants = syncVariants.map((variant) => {
    const parts = (variant.name || "").split("/").map((part) => part.trim());

    const color = parts.length > 1 ? parts[0] : "Default";
    const size =
      parts.length > 1 ? parts.slice(1).join(" / ") : parts[0] || "One Size";

    return {
      color,
      size,
      quantity: 0,
      sku: `PF-${variant.id}`,
      supplierVariantId: String(variant.id),
      supplierSku: variant.sku || "",
      barcode: "",
    };
  });

  const firstPrice = Number(syncVariants[0].retail_price);

  const product = await Product.create({
    name: syncProduct.name,
    description: "",
    brand: "J.Rome",
    category: "Apparel",
    gender: "Unisex",
    price: Number.isFinite(firstPrice) && firstPrice > 0 ? firstPrice : 0,
    cost: 0,
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

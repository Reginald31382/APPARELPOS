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

  console.log(
    "Printful variant mapping:",
    syncVariants.map((variant) => ({
      id: variant.id,
      variant_id: variant.variant_id,
      name: variant.name,
      size: variant.size,
      color: variant.color,
      color_code: variant.color_code,
    })),
  );

  if (!syncProduct || syncVariants.length === 0) {
    return res.status(400).json({
      message: "Printful product has no synced variants to import.",
    });
  }

  const variants = await Promise.all(
    syncVariants.map(async (variant) => {
      const variantName = variant.name || "";
      const parts = variantName.split("/").map((part) => part.trim());

      const color = parts.length > 1 ? parts[0] : "Default";
      const size = parts.length > 1 ? parts[1] : "One Size";

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

// GET /api/printful/products/:id/validate
// Validates imported variant ID formats locally.
// Does not call Printful or create orders.
export const validateImportedPrintfulProduct = asyncHandler(
  async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (product.supplier?.name !== "Printful") {
      return res.status(400).json({
        success: false,
        message: "This product is not supplied by Printful.",
      });
    }

    const variants = product.variants || [];

    if (!variants.length) {
      return res.status(400).json({
        success: false,
        message: "No variants found for this product.",
      });
    }

    const results = variants.map((variant) => {
      const match = String(variant.sku || "").match(/^PF-(\d+)$/);
      const syncVariantId = match ? Number(match[1]) : NaN;

      return {
        sku: variant.sku,
        supplierVariantId: variant.supplierVariantId,
        valid:
          Number.isSafeInteger(syncVariantId) &&
          syncVariantId > 0 &&
          String(variant.supplierVariantId) === String(syncVariantId),
      };
    });

    return res.status(200).json({
      success: true,
      product: product.name,
      valid: results.every((variant) => variant.valid),
      variants: results,
      createsOrder: false,
      submitsFulfillment: false,
    });
  },
);

// GET /api/printful/products/:id/verify-variants
// Checks each imported Sync Variant ID against Printful's variant-cost API.
// Does not create orders or submit fulfillment.
export const verifyPrintfulVariantIds = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  if (product.supplier?.name !== "Printful") {
    return res.status(400).json({
      success: false,
      message: "This product is not supplied by Printful.",
    });
  }

  const details = await getPrintfulProductDetails(product.supplier.productId);

  const printfulVariants = details?.sync_variants || [];

  const results = (product.variants || []).map((variant) => {
    const syncVariantId = String(variant.supplierVariantId || "");

    const matchedVariant = printfulVariants.find(
      (printfulVariant) => String(printfulVariant.id) === syncVariantId,
    );

    return {
      sku: variant.sku,
      supplierVariantId: syncVariantId,
      recognizedByPrintful: Boolean(matchedVariant),
      ...(matchedVariant
        ? {
            catalogVariantId: matchedVariant.variant_id,
            printfulName: matchedVariant.name,
          }
        : {}),
    };
  });

  return res.status(200).json({
    success: true,
    product: product.name,
    allRecognized:
      results.length > 0 &&
      results.every((variant) => variant.recognizedByPrintful),
    variants: results,
    createsOrder: false,
    submitsFulfillment: false,
  });
});

export const dryRunPrintfulVariant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { sku, quantity = 1 } = req.query;

  if (!sku) {
    return res.status(400).json({
      success: false,
      message: "Provide a variant SKU using the sku query parameter.",
    });
  }

  const parsedQuantity = Number(quantity);

  if (
    !Number.isInteger(parsedQuantity) ||
    parsedQuantity < 1 ||
    parsedQuantity > 100
  ) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be an integer between 1 and 100.",
    });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  const variant = product.variants.find((item) => item.sku === sku);

  if (!variant) {
    return res.status(404).json({
      success: false,
      message: "Variant SKU not found on this product.",
    });
  }

  if (
    product.fulfillmentType !== "PrintOnDemand" ||
    product.supplier?.name !== "Printful"
  ) {
    return res.status(400).json({
      success: false,
      message: "This product is not configured for Printful fulfillment.",
    });
  }

  const syncVariantId = Number(variant.supplierVariantId);
  const unitPrice = Number(variant.salePrice ?? variant.price ?? product.price);

  if (!Number.isSafeInteger(syncVariantId) || syncVariantId <= 0) {
    return res.status(400).json({
      success: false,
      message: "The variant has an invalid Printful Sync Variant ID.",
    });
  }

  if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
    return res.status(400).json({
      success: false,
      message: "The variant has an invalid retail price.",
    });
  }

  return res.json({
    success: true,
    dryRun: true,
    product: product.name,
    variant: {
      sku: variant.sku,
      color: variant.color,
      size: variant.size,
      supplierVariantId: variant.supplierVariantId,
    },
    printfulPayload: {
      sync_variant_id: syncVariantId,
      quantity: parsedQuantity,
      retail_price: unitPrice.toFixed(2),
    },
    createsMongoOrder: false,
    createsStripeSession: false,
    submitsToPrintful: false,
  });
});

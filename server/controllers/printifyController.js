import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/Products.js";
import {
  getPrintifyShops,
  getPrintifyProducts,
  getPrintifyProduct,
  calculatePrintifyShipping,
} from "../services/printifyService.js";

export const testPrintifyConnection = asyncHandler(async (req, res) => {
  const shops = await getPrintifyShops();

  res.status(200).json({
    success: true,
    message: "Printify connection successful.",
    shops: (Array.isArray(shops) ? shops : []).map((shop) => ({
      id: shop.id,
      title: shop.title,
      sales_channel: shop.sales_channel,
    })),
  });
});

export const importProduct = asyncHandler(async (req, res) => {
  const printifyProductId = String(req.params.id);

  const existing = await Product.findOne({
    "supplier.name": "Printify",
    "supplier.productId": printifyProductId,
  });

  if (existing) {
    return res.status(409).json({
      success: false,
      message: "This Printify product has already been imported.",
      product: existing,
    });
  }

  const details = await getPrintifyProduct(printifyProductId);

  const enabledVariants = (details.variants || []).filter(
    (variant) => variant.is_enabled === true && variant.is_available !== false,
  );

  if (!enabledVariants.length) {
    return res.status(400).json({
      success: false,
      message: "No enabled, available Printify variants were found.",
    });
  }

  const variants = enabledVariants.map((variant) => {
    const parts = (variant.title || "").split("/").map((part) => part.trim());

    const size = parts.length > 1 ? parts[0] : "One Size";
    const color = parts.length > 1 ? parts.slice(1).join(" / ") : "Default";

    // Printify provides costs in cents.
    const cost = variant.cost == null ? null : Number(variant.cost) / 100;

    if (cost === null || !Number.isFinite(cost) || cost <= 0) {
      throw new Error(
        `Printify variant ${variant.id} has no valid production cost.`,
      );
    }

    // Target approximately 30% gross margin, rounding up to a .99 price.
    const minimumPrice = cost / 0.7;
    const retailPrice = Math.ceil(minimumPrice + 0.01) - 0.01;

    return {
      color,
      size,
      quantity: 0,
      sku: `PY-${printifyProductId}-${variant.id}`,
      supplierVariantId: String(variant.id),
      supplierSku: variant.sku || "",
      barcode: "",
      cost: Number(cost.toFixed(2)),
      price: Number(retailPrice.toFixed(2)),
      salePrice: null,
    };
  });

  const images = (details.images || [])
    .map((image) => image.src)
    .filter(Boolean);

  const firstVariant = variants[0];

  const product = await Product.create({
    name: details.title,
    description: details.description || "",
    brand: "J.Rome",
    category: "Sweatshirts",
    gender: "Unisex",
    price: firstVariant.price,
    salePrice: 0,
    cost: firstVariant.cost,
    weight: 0,
    images,
    variants,
    fulfillmentType: "PrintOnDemand",
    supplier: {
      name: "Printify",
      productId: printifyProductId,
      syncEnabled: true,
    },
    featured: false,
    active: false,
  });

  return res.status(201).json({
    success: true,
    message: "Printify product imported successfully.",
    product,
  });
});

export const getProducts = asyncHandler(async (req, res) => {
  const response = await getPrintifyProducts();

  const printifyProducts = Array.isArray(response)
    ? response
    : response?.data || [];

  const importedProducts = await Product.find({
    "supplier.name": "Printify",
  })
    .select("supplier.productId")
    .lean();

  const importedIds = new Set(
    importedProducts.map((product) => String(product.supplier?.productId)),
  );

  res.status(200).json({
    success: true,
    products: printifyProducts.map((product) => ({
      ...product,
      imported: importedIds.has(String(product.id)),
    })),
  });
});

export const testPrintifyShipping = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity = 1, shippingAddress } = req.body;

  if (!productId || !variantId || !shippingAddress) {
    return res.status(400).json({
      success: false,
      message: "Product ID, variant ID, and shipping address are required.",
    });
  }

  const numericVariantId = Number(variantId);
  const numericQuantity = Number(quantity);

  if (
    !Number.isSafeInteger(numericVariantId) ||
    numericVariantId <= 0 ||
    !Number.isInteger(numericQuantity) ||
    numericQuantity < 1 ||
    numericQuantity > 100
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid variant ID or quantity.",
    });
  }

  const {
    firstName,
    lastName,
    email = "",
    phone = "",
    address1,
    address2 = "",
    city,
    state,
    zipCode,
    country = "US",
  } = shippingAddress;

  if (
    !firstName ||
    !lastName ||
    !address1 ||
    !city ||
    !state ||
    !zipCode ||
    !country
  ) {
    return res.status(400).json({
      success: false,
      message: "A complete shipping address is required.",
    });
  }

  const rates = await calculatePrintifyShipping({
    lineItems: [
      {
        product_id: String(productId),
        variant_id: numericVariantId,
        quantity: numericQuantity,
      },
    ],
    addressTo: {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address1,
      address2,
      city,
      region: state,
      zip: zipCode,
      country: String(country).toUpperCase(),
    },
  });

  const shippingMethods = Object.entries(rates || {})
    .filter(([, cost]) => cost != null)
    .map(([method, cost]) => ({
      method,
      costCents: Number(cost),
      costDollars: Number(cost) / 100,
    }))
    .filter((rate) => Number.isFinite(rate.costCents) && rate.costCents >= 0);

  return res.status(200).json({
    success: true,
    message: "Printify shipping rates retrieved successfully.",
    rates: shippingMethods,
  });
});

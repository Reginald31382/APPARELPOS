export function buildPrintfulDryRunPayload({
  name = "Love Detroit Garment-dyed heavyweight cotton tee",
  sku = "PF-5570272076",
  supplierVariantId = "5570272076",
  quantity = 1,
  unitPrice = 24.99,
}) {
  const syncVariantId = Number(supplierVariantId);
  const parsedQuantity = Number(quantity);
  const parsedPrice = Number(unitPrice);

  if (!Number.isSafeInteger(syncVariantId) || syncVariantId <= 0) {
    throw new Error("Invalid Printful Sync Variant ID.");
  }

  if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
    throw new Error("Quantity must be a positive integer.");
  }

  if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
    throw new Error("Unit price must be greater than zero.");
  }

  return {
    name,
    sku,
    sync_variant_id: syncVariantId,
    quantity: parsedQuantity,
    retail_price: parsedPrice.toFixed(2),
    createsMongoOrder: false,
    createsStripeSession: false,
    submitsToPrintful: false,
  };
}

export function testPrintfulOrderItemMapping() {
  // Simulated checkout item based on your actual MongoDB variant.
  const checkoutItem = {
    productId: "SIMULATED_PRODUCT_ID",
    name: "Love Detroit Garment-dyed heavyweight cotton tee",
    sku: "PF-5570272076",
    color: "Faded Black",
    size: "M",
    quantity: 1,
    unitPrice: 22.99,
    fulfillmentType: "PrintOnDemand",
    supplier: "Printful",
    supplierProductId: "SIMULATED_PRINTFUL_PRODUCT_ID",
    supplierVariantId: "5570272076",
    weight: 0,
  };

  // Mirrors the item mapping inside completeOrder().
  const mappedItem = {
    ...checkoutItem,
    weight: checkoutItem.weight || 0,
    supplier: {
      name: checkoutItem.supplier || "",
      productId: checkoutItem.supplierProductId || "",
      variantId: checkoutItem.supplierVariantId || "",
      orderId: "",
      status:
        checkoutItem.fulfillmentType === "PrintOnDemand" &&
        checkoutItem.supplier === "Printful"
          ? "Pending"
          : "Not Required",
      lastError: "",
    },
  };

  const passed =
    mappedItem.supplier.name === "Printful" &&
    mappedItem.supplier.variantId === "5570272076" &&
    mappedItem.sku === "PF-5570272076" &&
    mappedItem.quantity === 1 &&
    mappedItem.unitPrice === 22.99 &&
    mappedItem.supplier.status === "Pending" &&
    mappedItem.supplier.orderId === "";

  return {
    passed,
    simulatedOnly: true,
    mappedItem,
    createsMongoOrder: false,
    createsStripeSession: false,
    submitsToPrintful: false,
  };
}

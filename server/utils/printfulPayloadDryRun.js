export function buildPrintfulPayloadDryRun() {
  // Simulated order data only. No database or API calls.
  const order = {
    orderNumber: "TEST-1001",
    customerEmail: "test@example.com",
    shippingAddress: {
      firstName: "Test",
      lastName: "Customer",
      address1: "123 Example Street",
      address2: "",
      city: "Detroit",
      state: "MI",
      country: "US",
      zipCode: "48201",
      phone: "5555550100",
    },
  };

  const item = {
    name: "Love Detroit Garment-dyed heavyweight cotton tee",
    sku: "PF-5570272076",
    quantity: 1,
    unitPrice: 22.99,
    supplier: {
      name: "Printful",
      variantId: "5570272076",
    },
  };

  const syncVariantId = Number(item.supplier.variantId);

  if (!Number.isSafeInteger(syncVariantId) || syncVariantId <= 0) {
    throw new Error("Invalid Printful Sync Variant ID.");
  }

  if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
    throw new Error("Invalid item quantity.");
  }

  if (!Number.isFinite(item.unitPrice) || item.unitPrice <= 0) {
    throw new Error("Invalid retail price.");
  }

  const address = order.shippingAddress;
  const recipientName = [address.firstName, address.lastName]
    .filter(Boolean)
    .join(" ");

  const payload = {
    external_id: `AP-TEST-${order.orderNumber}`,
    shipping: "STANDARD",
    recipient: {
      name: recipientName,
      address1: address.address1,
      address2: address.address2,
      city: address.city,
      state_code: address.state,
      country_code: address.country,
      zip: address.zipCode,
      phone: address.phone,
      email: order.customerEmail,
    },
    items: [
      {
        sync_variant_id: syncVariantId,
        quantity: item.quantity,
        retail_price: item.unitPrice.toFixed(2),
        external_id: `${order.orderNumber}-${item.sku}`,
      },
    ],
  };

  return {
    passed:
      payload.items[0].sync_variant_id === 5570272076 &&
      payload.items[0].quantity === 1 &&
      payload.items[0].retail_price === "22.99",
    dryRun: true,
    payload,
    createsMongoOrder: false,
    createsStripeSession: false,
    submitsToPrintful: false,
  };
}

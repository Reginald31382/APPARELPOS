import Order from "../models/Order.js";

const PRINTFUL_API_URL = "https://api.printful.com";

export async function submitPrintfulOrder(orderId) {
  const order = await Order.findById(orderId);

  if (!order || order.paymentStatus !== "Paid") {
    throw new Error("A paid order is required for Printful fulfillment.");
  }

  const printfulItems = order.items.filter(
    (item) =>
      item.fulfillmentType === "PrintOnDemand" &&
      item.supplier?.name === "Printful",
  );

  if (printfulItems.length === 0) {
    return order;
  }

  const token = process.env.PRINTFUL_API_TOKEN;

  if (!token) {
    throw new Error("PRINTFUL_API_TOKEN is not configured.");
  }

  // Do not submit items that have already been submitted.
  if (
    printfulItems.some(
      (item) =>
        item.supplier.status === "Submitted" ||
        item.supplier.status === "Processing" ||
        item.supplier.status === "Shipped" ||
        item.supplier.status === "Delivered",
    )
  ) {
    return order;
  }

  const address = order.shippingAddress || {};
  const recipientName = [address.firstName, address.lastName]
    .filter(Boolean)
    .join(" ");

  if (
    !recipientName ||
    !address.address1 ||
    !address.city ||
    !address.zip ||
    !address.country
  ) {
    throw new Error("The order has an incomplete shipping address.");
  }

  const items = printfulItems.map((item) => {
    const syncVariantId = Number(item.supplier.variantId);

    if (!Number.isSafeInteger(syncVariantId) || syncVariantId <= 0) {
      throw new Error(
        `Missing or invalid Printful synced variant ID for ${item.name}.`,
      );
    }

    return {
      sync_variant_id: syncVariantId,
      quantity: item.quantity,
      retail_price: Number(item.unitPrice).toFixed(2),
      external_id: `${order.orderNumber}-${item.sku}`,
    };
  });

  // Use a stable external ID so the Printful order can be identified
  // if the request times out after Printful receives it.
  const externalId = `APPARELPOS-${order._id}`;

  const response = await fetch(`${PRINTFUL_API_URL}/orders?confirm=1`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      external_id: externalId,
      shipping: "STANDARD",
      recipient: {
        name: recipientName,
        address1: address.address1,
        address2: address.address2 || "",
        city: address.city,
        state_code: address.state || "",
        country_code: address.country || "US",
        zip: address.zipCode || address.zip,
        phone: address.phone || "",
        email: order.customerEmail || address.email || "",
      },
      items,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Printful order submission failed:", data);

    throw new Error(
      data?.result?.error ||
        data?.error?.message ||
        `Printful returned HTTP ${response.status}.`,
    );
  }

  const printfulOrder = data.result;

  if (!printfulOrder?.id) {
    throw new Error("Printful did not return an order ID.");
  }

  // Save the result on every Printful item in the ApparelPOS order.
  for (const item of printfulItems) {
    item.supplier.orderId = String(printfulOrder.id);
    item.supplier.status = "Submitted";
    item.supplier.lastError = "";
  }

  await order.save();

  return order;
}

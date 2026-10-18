import Order from "../models/Order.js";

const PRINTFUL_API_URL = "https://api.printful.com";

async function getPrintfulOrder(externalId, token) {
  const response = await fetch(
    `${PRINTFUL_API_URL}/orders/@${encodeURIComponent(externalId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );

  if (response.status === 404) return null;

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message || `Printful lookup failed: HTTP ${response.status}`,
    );
  }

  return data.result || null;
}

export async function submitPrintfulOrder(orderId) {
  const token = process.env.PRINTFUL_API_TOKEN;

  if (!token) {
    throw new Error("PRINTFUL_API_TOKEN is not configured.");
  }

  const order = await Order.findById(orderId);

  if (!order || order.paymentStatus !== "Paid") {
    throw new Error("A paid order is required for Printful fulfillment.");
  }

  const printfulItems = order.items.filter(
    (item) =>
      item.fulfillmentType === "PrintOnDemand" &&
      item.supplier?.name === "Printful",
  );

  if (!printfulItems.length) return order;

  const externalId = `AP-${order._id}`;

  // Recover an order Printful may have received before a timeout.
  const existingOrder = await getPrintfulOrder(externalId, token);

  if (existingOrder) {
    for (const item of printfulItems) {
      item.supplier.orderId = String(existingOrder.id);

      item.supplier.status =
        existingOrder.status === "draft" ? "Submitted" : "Processing";

      item.supplier.lastError = "";
    }

    await order.save();
    return order;
  }

  // Claim pending items atomically to prevent concurrent submissions.
  const claimedOrder = await Order.findOneAndUpdate(
    {
      _id: orderId,
      paymentStatus: "Paid",
      items: {
        $elemMatch: {
          fulfillmentType: "PrintOnDemand",
          "supplier.name": "Printful",
          "supplier.status": "Pending",
        },
      },
    },
    {
      $set: {
        "items.$[item].supplier.status": "Submitting",
        "items.$[item].supplier.lastError": "",
      },
    },
    {
      new: true,
      arrayFilters: [
        {
          "item.fulfillmentType": "PrintOnDemand",
          "item.supplier.name": "Printful",
          "item.supplier.status": "Pending",
        },
      ],
    },
  );

  if (!claimedOrder) {
    const latestOrder = await Order.findById(orderId);

    const stuckItems = latestOrder?.items.filter(
      (item) =>
        item.fulfillmentType === "PrintOnDemand" &&
        item.supplier?.name === "Printful" &&
        item.supplier.status === "Submitting" &&
        !item.supplier.orderId,
    );

    if (stuckItems?.length) {
      throw new Error(
        "Printful submission needs manual review. Verify the order in Printful before retrying.",
      );
    }

    return latestOrder;
  }
  const claimedItems = claimedOrder.items.filter(
    (item) =>
      item.fulfillmentType === "PrintOnDemand" &&
      item.supplier?.name === "Printful" &&
      item.supplier.status === "Submitting",
  );

  try {
    const address = claimedOrder.shippingAddress || {};
    const recipientName = [address.firstName, address.lastName]
      .filter(Boolean)
      .join(" ");
    const zip = address.zipCode || address.zip || "";

    if (
      !recipientName ||
      !address.address1 ||
      !address.city ||
      !zip ||
      !address.country
    ) {
      throw new Error("The order has an incomplete shipping address.");
    }

    const items = claimedItems.map((item) => {
      const syncVariantId = Number(item.supplier.variantId);

      if (!Number.isSafeInteger(syncVariantId) || syncVariantId <= 0) {
        throw new Error(`Invalid Printful Sync Variant ID for ${item.name}.`);
      }

      return {
        sync_variant_id: syncVariantId,
        quantity: item.quantity,
        retail_price: Number(item.unitPrice).toFixed(2),
        external_id: `${claimedOrder.orderNumber}-${item.sku}`,
      };
    });

    const response = await fetch(`${PRINTFUL_API_URL}/orders?confirm=0`, {
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
          zip,
          phone: address.phone || "",
          email: claimedOrder.customerEmail || address.email || "",
        },
        items,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
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

    for (const item of claimedItems) {
      item.supplier.orderId = String(printfulOrder.id);
      item.supplier.status = "Submitted";
      item.supplier.lastError = "";
    }

    await claimedOrder.save();
    return claimedOrder;
  } catch (error) {
    for (const item of claimedItems) {
      item.supplier.lastError = error.message;
    }

    await claimedOrder.save();

    console.error("Printful submission needs review:", {
      orderId: claimedOrder._id,
      error: error.message,
    });

    throw error;
  }
}

export async function validatePrintfulOrder(orderId) {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  const items = order.items.filter(
    (item) =>
      item.fulfillmentType === "PrintOnDemand" &&
      item.supplier?.name === "Printful",
  );

  if (!items.length) {
    throw new Error("No Printful items found on this order.");
  }

  const address = order.shippingAddress || {};
  const recipientName = [address.firstName, address.lastName]
    .filter(Boolean)
    .join(" ");

  if (
    !recipientName ||
    !address.address1 ||
    !address.city ||
    !(address.zipCode || address.zip) ||
    !address.country
  ) {
    throw new Error("The shipping address is incomplete.");
  }

  const validatedItems = items.map((item) => {
    const syncVariantId = Number(item.supplier.variantId);

    if (!Number.isSafeInteger(syncVariantId) || syncVariantId <= 0) {
      throw new Error(`Invalid Printful Sync Variant ID for ${item.name}.`);
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error(`Invalid quantity for ${item.name}.`);
    }

    return {
      name: item.name,
      sync_variant_id: syncVariantId,
      quantity: item.quantity,
      retail_price: Number(item.unitPrice).toFixed(2),
    };
  });

  return {
    valid: true,
    orderId: String(order._id),
    paymentStatus: order.paymentStatus,
    printfulItems: validatedItems,
    shippingAddressComplete: true,
    createsPrintfulOrder: false,
  };
}

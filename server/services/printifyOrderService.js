import Order from "../models/Order.js";

const PRINTIFY_API_URL = "https://api.printify.com/v1";

function getConfig() {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!token) {
    throw new Error("PRINTIFY_API_TOKEN is not configured.");
  }

  if (!shopId) {
    throw new Error("PRINTIFY_SHOP_ID is not configured.");
  }

  return { token, shopId };
}

async function printifyRequest(path, { token, ...options } = {}) {
  const response = await fetch(`${PRINTIFY_API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Printify returned an invalid JSON response.");
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Printify returned HTTP ${response.status}.`,
    );
  }

  return data;
}

async function findPrintifyOrderByExternalId(externalId, config) {
  // Printify's order-list endpoint is paginated.
  // Search existing orders before creating another one.
  for (let page = 1; page <= 100; page += 1) {
    const query = new URLSearchParams({
      limit: "10",
      page: String(page),
    });

    const data = await printifyRequest(
      `/shops/${encodeURIComponent(config.shopId)}/orders.json?${query}`,
      { token: config.token },
    );

    const orders = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];

    const match = orders.find(
      (printifyOrder) => printifyOrder.external_id === externalId,
    );

    if (match) return match;

    if (orders.length < 10) return null;
  }

  throw new Error(
    "Could not safely verify whether the Printify order already exists. Manual review is required.",
  );
}

function getPrintifyItems(order) {
  return order.items.filter(
    (item) =>
      item.fulfillmentType === "PrintOnDemand" &&
      item.supplier?.name === "Printify",
  );
}

function validatePrintifyItems(items) {
  return items.map((item) => {
    const productId = String(item.supplier?.productId || "").trim();
    const variantId = Number(item.supplier?.variantId);
    const quantity = Number(item.quantity);

    if (!productId) {
      throw new Error(`Missing Printify product ID for "${item.name}".`);
    }

    if (!Number.isSafeInteger(variantId) || variantId <= 0) {
      throw new Error(`Invalid Printify variant ID for "${item.name}".`);
    }

    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
      throw new Error(`Invalid quantity for "${item.name}".`);
    }

    return {
      product_id: productId,
      variant_id: variantId,
      quantity,
      external_id: String(item.sku || item.productId || item.name),
    };
  });
}

function buildAddress(order) {
  const address = order.shippingAddress || {};
  const firstName = String(address.firstName || "").trim();
  const lastName = String(address.lastName || "").trim();
  const email = String(order.customerEmail || address.email || "").trim();

  if (
    !firstName ||
    !lastName ||
    !address.address1 ||
    !address.city ||
    !(address.zipCode || address.zip) ||
    !address.country
  ) {
    throw new Error(
      "The order has an incomplete shipping address. A first name, last name, street, city, ZIP/postal code, and country are required.",
    );
  }

  return {
    first_name: firstName,
    last_name: lastName,
    email,
    phone: address.phone || "",
    country: address.country || "US",
    region: address.state || "",
    address1: address.address1,
    address2: address.address2 || "",
    city: address.city,
    zip: address.zipCode || address.zip,
  };
}

function savePrintifyOrderId(items, orderId) {
  for (const item of items) {
    item.supplier.orderId = String(orderId);
    item.supplier.status = "Submitted";
    item.supplier.lastError = "";
  }
}

function getPrintifyShippingMethod(order) {
  const carrier = String(order.shipping?.carrier || "")
    .trim()
    .toLowerCase();
  const service = String(order.shipping?.service || "")
    .trim()
    .toLowerCase();
  const id = String(order.shipping?.rateId || order.shipping?.id || "")
    .trim()
    .toLowerCase();

  if (carrier !== "printify") {
    throw new Error(
      "The saved shipping selection is not a Printify shipping method.",
    );
  }

  if (id === "printify-standard" || service === "standard shipping") {
    return {
      shipping_method: 1,
      is_printify_express: false,
      is_economy_shipping: false,
    };
  }

  if (id === "printify-express" || service === "express shipping") {
    return {
      shipping_method: 2,
      is_printify_express: false,
      is_economy_shipping: false,
    };
  }

  if (id === "printify-priority" || service === "priority shipping") {
    return {
      shipping_method: 2,
      is_printify_express: false,
      is_economy_shipping: false,
    };
  }

  if (id === "printify-printify-express" || service === "printify express") {
    return {
      shipping_method: 3,
      is_printify_express: true,
      is_economy_shipping: false,
    };
  }

  if (id === "printify-economy" || service === "economy shipping") {
    return {
      shipping_method: 4,
      is_printify_express: false,
      is_economy_shipping: true,
    };
  }

  throw new Error(
    `Unsupported Printify shipping selection: "${order.shipping?.service || id || "unknown"}".`,
  );
}

export async function submitPrintifyOrder(orderId) {
  const config = getConfig();

  const order = await Order.findById(orderId);

  if (!order || order.paymentStatus !== "Paid") {
    throw new Error("A paid order is required for Printify fulfillment.");
  }

  const printifyItems = getPrintifyItems(order);

  if (!printifyItems.length) return order;

  const externalId = `AP-${order._id}`;

  // Recover an order that Printify received before a timeout.
  let existingOrder;

  try {
    existingOrder = await findPrintifyOrderByExternalId(externalId, config);
  } catch (error) {
    // Do not create another order when existence cannot be verified.
    for (const item of printifyItems) {
      if (item.supplier.status === "Submitting" && !item.supplier.orderId) {
        item.supplier.lastError = error.message;
      }
    }

    await order.save();
    throw error;
  }

  if (existingOrder) {
    const existingId = existingOrder.id;

    if (!existingId) {
      throw new Error(
        "A matching Printify order was found without an order ID. Manual review is required.",
      );
    }

    savePrintifyOrderId(printifyItems, existingId);
    await order.save();

    return order;
  }

  // Claim only Pending Printify items to prevent concurrent submissions.
  const claimedOrder = await Order.findOneAndUpdate(
    {
      _id: orderId,
      paymentStatus: "Paid",
      items: {
        $elemMatch: {
          fulfillmentType: "PrintOnDemand",
          "supplier.name": "Printify",
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
          "item.supplier.name": "Printify",
          "item.supplier.status": "Pending",
        },
      ],
    },
  );

  if (!claimedOrder) {
    const latestOrder = await Order.findById(orderId);

    const needsReview = getPrintifyItems(latestOrder || { items: [] }).some(
      (item) => item.supplier.status === "Submitting" && !item.supplier.orderId,
    );

    if (needsReview) {
      throw new Error(
        "Printify submission needs manual review. Check Printify for the external ID before retrying.",
      );
    }

    return latestOrder;
  }

  const claimedItems = getPrintifyItems(claimedOrder).filter(
    (item) => item.supplier.status === "Submitting",
  );

  try {
    const lineItems = validatePrintifyItems(claimedItems);
    const addressTo = buildAddress(claimedOrder);
    const shippingMethod = getPrintifyShippingMethod(claimedOrder);

    const data = await printifyRequest(
      `/shops/${encodeURIComponent(config.shopId)}/orders.json`,
      {
        token: config.token,
        method: "POST",
        body: JSON.stringify({
          external_id: externalId,
          label: claimedOrder.orderNumber || externalId,
          line_items: lineItems,
          ...shippingMethod,
          send_shipping_notification: false,
          address_to: addressTo,
        }),
      },
    );

    const printifyOrder = data?.id ? data : data?.data?.id ? data.data : null;

    if (!printifyOrder?.id) {
      throw new Error(
        "Printify did not return an order ID. Check Printify before retrying.",
      );
    }

    savePrintifyOrderId(claimedItems, printifyOrder.id);
    await claimedOrder.save();

    return claimedOrder;
  } catch (error) {
    for (const item of claimedItems) {
      item.supplier.lastError = error.message;
      // Leave status as Submitting until the remote order's existence
      // is checked. A timeout does not prove Printify rejected the order.
    }

    await claimedOrder.save();

    console.error("Printify submission needs review:", {
      orderId: String(claimedOrder._id),
      externalId,
      error: error.message,
      action:
        "Verify the external ID in Printify before attempting another submission.",
    });

    throw error;
  }
}

export async function validatePrintifyOrder(orderId) {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  const items = getPrintifyItems(order);

  if (!items.length) {
    throw new Error("No Printify items found on this order.");
  }

  const lineItems = validatePrintifyItems(items);

  const addressTo = buildAddress(order);

  const shippingMethod = getPrintifyShippingMethod(order);

  return {
    valid: true,
    orderId: String(order._id),
    orderNumber: order.orderNumber,
    paymentStatus: order.paymentStatus,
    printifyItems: lineItems,
    shippingAddressComplete: true,
    shippingMethod,
    createsPrintifyOrder: false,
    submitsToProduction: false,
  };
}

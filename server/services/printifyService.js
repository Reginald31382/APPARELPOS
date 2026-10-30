const PRINTIFY_API_URL = "https://api.printify.com/v1";

export async function printifyRequest(path, options = {}) {
  const token = process.env.PRINTIFY_API_TOKEN;

  if (!token) {
    throw new Error("PRINTIFY_API_TOKEN is not configured.");
  }

  const response = await fetch(`${PRINTIFY_API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "ApparelPOS",
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Printify API returned HTTP ${response.status}.`,
    );
  }

  return data;
}

export async function getPrintifyShops() {
  return printifyRequest("/shops.json");
}

export async function getPrintifyProducts() {
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!shopId) {
    throw new Error("PRINTIFY_SHOP_ID is not configured.");
  }

  return printifyRequest(`/shops/${encodeURIComponent(shopId)}/products.json`);
}

export async function getPrintifyProduct(productId) {
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!shopId) {
    throw new Error("PRINTIFY_SHOP_ID is not configured.");
  }

  return printifyRequest(
    `/shops/${encodeURIComponent(shopId)}/products/${encodeURIComponent(productId)}.json`,
  );
}

export async function calculatePrintifyShipping({ lineItems, addressTo }) {
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!shopId) {
    throw new Error("PRINTIFY_SHOP_ID is not configured.");
  }

  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    throw new Error("At least one Printify line item is required.");
  }

  if (!addressTo || typeof addressTo !== "object") {
    throw new Error("A valid shipping address is required.");
  }

  return printifyRequest(
    `/shops/${encodeURIComponent(shopId)}/orders/shipping.json`,
    {
      method: "POST",
      body: JSON.stringify({
        line_items: lineItems,
        address_to: addressTo,
      }),
    },
  );
}

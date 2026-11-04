const PRINTIFY_API_URL = "https://api.printify.com/v1";

export async function printifyRequest(path, options = {}) {
  const token = process.env.PRINTIFY_API_TOKEN;

  if (!token) {
    console.error("[PRINTIFY ERROR] Missing PRINTIFY_API_TOKEN");
    throw new Error("PRINTIFY_API_TOKEN is not configured.");
  }

  try {
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

    const responseText = await response.text();

    let data;

    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      data = responseText;
    }

    if (!response.ok) {
      console.error("[PRINTIFY API ERROR]", {
        status: response.status,
        statusText: response.statusText,
        path,
        response: data,
      });

      throw new Error(
        data?.message ||
          data?.error ||
          `Printify API returned HTTP ${response.status}.`,
      );
    }

    return data;
  } catch (error) {
    console.error("[PRINTIFY REQUEST FAILED]", {
      path,
      message: error.message,
    });

    throw error;
  }
}

export async function getPrintifyShops() {
  return printifyRequest("/shops.json");
}

export async function getPrintifyProducts() {
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!shopId) {
    console.error("[PRINTIFY ERROR] Missing PRINTIFY_SHOP_ID");
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

const PRINTFUL_API_URL = "https://api.printful.com";

export async function getPrintfulProducts() {
  const token = process.env.PRINTFUL_API_TOKEN;

  if (!token) {
    throw new Error("PRINTFUL_API_TOKEN is not configured.");
  }

  const response = await fetch(`${PRINTFUL_API_URL}/store/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Printful API error:", data);
    throw new Error(
      `Printful API request failed with status ${response.status}.`,
    );
  }

  console.log("Printful products response:", JSON.stringify(data, null, 2));

  return data;
}

export async function getPrintfulProductDetails(productId) {
  const token = process.env.PRINTFUL_API_TOKEN;

  if (!token) {
    throw new Error("PRINTFUL_API_TOKEN is not configured.");
  }

  const response = await fetch(
    `${PRINTFUL_API_URL}/store/products/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Printful product details error:", data);
    throw new Error(
      `Printful product request failed with status ${response.status}.`,
    );
  }

  return data.result;
}

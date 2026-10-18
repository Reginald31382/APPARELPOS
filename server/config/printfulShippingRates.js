const US_RATES = {
  shirts: { first: 4.95, additional: 2.2 },
  hoodies: { first: 8.79, additional: 2.5 },
  sweatshirts: { first: 8.79, additional: 2.5 },
  pants: { first: 8.79, additional: 2.5 },
  youthClothing: { first: 4.69, additional: 2.0 },
  youthHoodies: { first: 8.29, additional: 2.5 },
  accessories: { first: 4.69, additional: 2.0 },
};

const CATEGORY_MAP = {
  apparel: "shirts",
  shirts: "shirts",
  "t-shirts": "shirts",
  "short sleeve shirts": "shirts",
  "long sleeve shirts": "shirts",
  hoodies: "hoodies",
  sweatshirts: "sweatshirts",
  pants: "pants",
  shorts: "pants",
  accessories: "accessories",
};

export const calculatePrintfulShipping = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No Printful items were provided.");
  }

  const quantitiesByRate = {};

  for (const item of items) {
    const quantity = Number(item.quantity);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      throw new Error("Invalid Printful item quantity.");
    }

    const category = String(item.category || "")
      .trim()
      .toLowerCase();

    let rateKey = CATEGORY_MAP[category];

    const isYouth = ["kids", "youth"].includes(
      String(item.gender || "")
        .trim()
        .toLowerCase(),
    );

    if (isYouth && category === "hoodies") {
      rateKey = "youthHoodies";
    } else if (isYouth && rateKey === "shirts") {
      rateKey = "youthClothing";
    }

    if (!US_RATES[rateKey]) {
      throw new Error(
        `Printful shipping is not configured for category "${item.category}".`,
      );
    }

    quantitiesByRate[rateKey] = (quantitiesByRate[rateKey] || 0) + quantity;
  }

  let total = 0;

  for (const [rateKey, quantity] of Object.entries(quantitiesByRate)) {
    const rate = US_RATES[rateKey];

    total += rate.first + (quantity - 1) * rate.additional;
  }

  return Number(total.toFixed(2));
};

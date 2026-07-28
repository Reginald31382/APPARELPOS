import Product from "../models/Products.js";

export const getShippingRates = async ({ items, shippingAddress }) => {
  let totalWeight = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    totalWeight += product.weight * item.quantity;
  }

  // Placeholder USPS rates
  return [
    {
      id: "ground",
      carrier: "USPS",
      service: "Ground Advantage",
      cost: 7.9,
      estimatedDays: "2-5",
      weight: totalWeight,
    },
    {
      id: "priority",
      carrier: "USPS",
      service: "Priority Mail",
      cost: 11.0,
      estimatedDays: "1-3",
      weight: totalWeight,
    },
    {
      id: "express",
      carrier: "USPS",
      service: "Priority Mail Express",
      cost: 35.65,
      estimatedDays: "1",
      weight: totalWeight,
    },
  ];
};

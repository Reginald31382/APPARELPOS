import Product from "../models/Products.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getStripe } from "../services/stripeService.js";

const validateCheckoutItems = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const validatedItems = [];

  for (const item of items) {
    const quantity = Number(item.quantity);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      throw new Error("Invalid item quantity.");
    }

    const product = await Product.findById(item.productId);

    if (!product || !product.active) {
      throw new Error("A product in your cart is unavailable.");
    }

    const variant = product.variants.find(
      (variant) =>
        variant.sku === item.sku &&
        variant.color === item.color &&
        variant.size === item.size,
    );

    if (!variant) {
      throw new Error(
        `The selected variant for ${product.name} is unavailable.`,
      );
    }

    const unitPrice =
      product.salePrice > 0 && product.salePrice < product.price
        ? product.salePrice
        : product.price;

    validatedItems.push({
      productId: product._id.toString(),
      name: product.name,
      sku: variant.sku,
      color: variant.color,
      size: variant.size,
      quantity,
      unitPrice,
      fulfillmentType: product.fulfillmentType || "InHouse",
      supplier: product.supplier?.name || "",
      supplierProductId: product.supplier?.productId || "",
      supplierVariantId: variant.supplierVariantId || "",
      image: product.images?.[0] || "",
      weight: product.weight || 0,
    });
  }

  return validatedItems;
};

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const stripe = getStripe();

  const { items, shipping, shippingAddress, subtotal, total } = req.body;

  const line_items = [
    ...items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          metadata: {
            productId: item.productId,
            sku: item.sku,
            color: item.color || "",
            size: item.size || "",
          },
        },
        unit_amount: Math.round(item.unitPrice * 100),
      },
      quantity: item.quantity,
    })),
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: shipping.service,
        },
        unit_amount: Math.round(shipping.cost * 100),
      },
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],

    line_items,

    customer_email: shippingAddress.email,

    success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/checkout`,

    metadata: {
      paymentSource: "stripe_checkout",
      subtotal: String(subtotal),
      tax: String(req.body.tax),
      total: String(total),
      shipping: JSON.stringify(shipping),
      shippingAddress: JSON.stringify(shippingAddress),
      items: JSON.stringify(items),
    },

    expand: ["payment_intent"],
  });

  res.json({
    id: session.id,
    url: session.url,
  });
});

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const stripe = getStripe();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
  });
});

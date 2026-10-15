import Product from "../models/Products.js";
import Settings from "../models/Settings.js";
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

    const regularPrice = Number(variant.price ?? product.price ?? 0);
    const variantSalePrice = Number(variant.salePrice ?? 0);

    const unitPrice =
      variantSalePrice > 0 && variantSalePrice < regularPrice
        ? variantSalePrice
        : regularPrice;

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

  const { items, shipping, shippingAddress } = req.body;

  if (!shipping || !shippingAddress) {
    return res.status(400).json({
      message: "Shipping selection and shipping address are required.",
    });
  }

  const shippingCost = Number(shipping.cost);

  if (!Number.isFinite(shippingCost) || shippingCost < 0) {
    return res.status(400).json({
      message: "Invalid shipping cost.",
    });
  }

  // Always retrieve authoritative prices from MongoDB.
  const validatedItems = await validateCheckoutItems(items);

  const subtotal = Number(
    validatedItems
      .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
      .toFixed(2),
  );

  const settings = await Settings.findOne().lean();

  const configuredTaxRate = Number(settings?.taxRate ?? 0.06);

  // Support settings stored as either 0.06 or 6.
  // Values from 0 to 1 are treated as decimal rates.
  const taxMultiplier =
    configuredTaxRate > 0 && configuredTaxRate <= 1
      ? configuredTaxRate
      : configuredTaxRate / 100;

  const tax = Number((subtotal * taxMultiplier).toFixed(2));

  const total = Number((subtotal + tax + shippingCost).toFixed(2));

  const line_items = [
    ...validatedItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${item.name} - ${item.color} / ${item.size}`,
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
    ...(shippingCost > 0
      ? [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: shipping.service || "Shipping",
              },
              unit_amount: Math.round(shippingCost * 100),
            },
            quantity: 1,
          },
        ]
      : []),
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: "Sales Tax",
        },
        unit_amount: Math.round(tax * 100),
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
      tax: String(tax),
      total: String(total),
      shipping: JSON.stringify({
        ...shipping,
        cost: shippingCost,
      }),
      shippingAddress: JSON.stringify(shippingAddress),
      items: JSON.stringify(validatedItems),
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

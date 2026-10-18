import Product from "../models/Products.js";
import Settings from "../models/Settings.js";
import PendingCheckout from "../models/PendingCheckout.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getStripe } from "../services/stripeService.js";
import { getShippingRates } from "../services/shippingService.js";

const FREE_SHIPPING_THRESHOLD = 250;

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

    if (!item.productId) {
      throw new Error("A valid product ID is required.");
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

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new Error(`Invalid price for ${product.name}.`);
    }

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

  const validatedItems = await validateCheckoutItems(items);

  const subtotal = Number(
    validatedItems
      .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
      .toFixed(2),
  );

  const availableRates = await getShippingRates({
    items: validatedItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
    shippingAddress,
  });

  // console.log("Selected shipping rate from frontend:", shipping);
  // console.log("Available shipping rates from backend:", availableRates);

  const selectedRate = availableRates.find(
    (rate) =>
      String(rate.id) === String(shipping.id) &&
      rate.service === shipping.service &&
      rate.carrier === shipping.carrier,
  );

  if (!selectedRate) {
    return res.status(400).json({
      message:
        "Your selected shipping option is no longer available. Please select a shipping option again.",
    });
  }

  const verifiedRateCost = Number(selectedRate.cost);

  if (!Number.isFinite(verifiedRateCost) || verifiedRateCost < 0) {
    return res.status(400).json({
      message: "The selected shipping rate is invalid.",
    });
  }

  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : verifiedRateCost;

  const settings = await Settings.findOne().lean();
  const configuredTaxRate = Number(settings?.taxRate ?? 0.06);

  const taxMultiplier =
    configuredTaxRate >= 0 && configuredTaxRate <= 1
      ? configuredTaxRate
      : configuredTaxRate / 100;

  if (!Number.isFinite(taxMultiplier) || taxMultiplier < 0) {
    throw new Error("The store tax rate is invalid.");
  }

  const tax = Number((subtotal * taxMultiplier).toFixed(2));
  const total = Number((subtotal + tax + shippingCost).toFixed(2));

  const verifiedShipping = {
    id: selectedRate.id,
    shipmentId: selectedRate.shipmentId ?? null,
    carrier: selectedRate.carrier,
    service: selectedRate.service,
    cost: shippingCost,
    estimatedDays: selectedRate.estimatedDays ?? null,
  };

  const line_items = [
    ...validatedItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${item.name} - ${item.color} / ${item.size}`,
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
                name: `${selectedRate.carrier} - ${selectedRate.service}`,
              },
              unit_amount: Math.round(shippingCost * 100),
            },
            quantity: 1,
          },
        ]
      : []),

    ...(tax > 0
      ? [
          {
            price_data: {
              currency: "usd",
              product_data: { name: "Sales Tax" },
              unit_amount: Math.round(tax * 100),
            },
            quantity: 1,
          },
        ]
      : []),
  ];

  // Save validated checkout details in MongoDB.
  const pendingCheckout = await PendingCheckout.create({
    items: validatedItems,
    shippingAddress,
    shipping: verifiedShipping,
    subtotal,
    tax,
    total,
  });

  let stripeSession;

  // Create the Stripe Checkout Session.
  try {
    stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      customer_email: shippingAddress.email || undefined,

      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,

      metadata: {
        paymentSource: "stripe_checkout",
        pendingCheckoutId: pendingCheckout._id.toString(),
      },
    });
  } catch (error) {
    // Stripe did not return a session, so remove the unused record.
    await PendingCheckout.findByIdAndDelete(pendingCheckout._id);
    throw error;
  }

  // Save the Stripe Session ID separately.
  // Keep the pending record if this save fails because Stripe
  // may already have created a valid Checkout Session.
  try {
    pendingCheckout.stripeCheckoutSessionId = stripeSession.id;
    await pendingCheckout.save();
  } catch (error) {
    console.error(
      "Could not save Stripe Checkout Session ID:",
      stripeSession.id,
      error,
    );

    throw error;
  }

  return res.json({
    id: stripeSession.id,
    url: stripeSession.url,
  });
});

export const createPaymentIntent = asyncHandler(async (req, res) => {
  return res.status(400).json({
    message: "Direct payment intents are disabled. Please use Stripe Checkout.",
  });
});

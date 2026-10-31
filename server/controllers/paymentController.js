import Product from "../models/Products.js";
import Settings from "../models/Settings.js";
import PendingCheckout from "../models/PendingCheckout.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getStripe } from "../services/stripeService.js";
import { getShippingRates } from "../services/shippingService.js";
import shippo from "../services/shipping/shippoClient.js";

const FREE_SHIPPING_THRESHOLD = 250;

// Normalize values for reliable address comparisons.
const normalizeValue = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

// Shippo may return an object reference or URL for a resource.
const normalizeResourceId = (value) => {
  if (!value) return "";

  const stringValue =
    typeof value === "object"
      ? value.objectId || value.object_id || value.id || ""
      : String(value);

  return stringValue.split("/").filter(Boolean).pop() || "";
};

// Support camelCase and snake_case API fields.
const getShippoField = (object, camelCase, snakeCase) =>
  object?.[camelCase] ?? object?.[snakeCase] ?? null;

// Verify that the original Shippo rate belongs to the original shipment
// and that the shipment destination matches the checkout address.
const verifyInHouseShippingRate = async ({ shipping, shippingAddress }) => {
  if (!shipping?.id || !shipping?.shipmentId) {
    return null;
  }

  const [rate, shipment] = await Promise.all([
    shippo.rates.get(shipping.id),
    shippo.shipments.get(shipping.shipmentId),
  ]);

  if (!rate || !shipment) {
    return null;
  }

  const rateShipmentId = normalizeResourceId(
    getShippoField(rate, "shipment", "shipment"),
  );

  const shipmentId = normalizeResourceId(
    getShippoField(shipment, "objectId", "object_id"),
  );

  if (
    rateShipmentId !== String(shipping.shipmentId) ||
    shipmentId !== String(shipping.shipmentId)
  ) {
    return null;
  }

  const destination = getShippoField(shipment, "addressTo", "address_to") || {};

  const addressMatches =
    normalizeValue(getShippoField(destination, "street1", "street_1")) ===
      normalizeValue(shippingAddress.address1) &&
    normalizeValue(destination.city) === normalizeValue(shippingAddress.city) &&
    normalizeValue(destination.state) ===
      normalizeValue(shippingAddress.state) &&
    normalizeValue(getShippoField(destination, "zip", "zip")) ===
      normalizeValue(shippingAddress.zipCode || shippingAddress.zip) &&
    normalizeValue(destination.country) ===
      normalizeValue(shippingAddress.country || "US");

  if (!addressMatches) {
    return null;
  }

  const carrier = getShippoField(rate, "provider", "provider");

  const serviceLevel =
    getShippoField(rate, "servicelevel", "servicelevel") || {};

  const service = serviceLevel.name;

  const cost = Number(getShippoField(rate, "amount", "amount"));

  const currency = getShippoField(rate, "currency", "currency");

  if (
    !carrier ||
    !service ||
    !Number.isFinite(cost) ||
    cost < 0 ||
    (currency && String(currency).toUpperCase() !== "USD")
  ) {
    return null;
  }

  // Make sure the carrier and service match the customer's selection.
  if (
    normalizeValue(carrier) !== normalizeValue(shipping.carrier) ||
    normalizeValue(service) !== normalizeValue(shipping.service)
  ) {
    return null;
  }

  return {
    id: shipping.id,
    shipmentId: shipping.shipmentId,
    carrier,
    service,
    cost,
    estimatedDays:
      getShippoField(rate, "estimatedDays", "estimated_days") ?? null,
  };
};

const validateCheckoutItems = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error("Your cart is empty.");
    error.statusCode = 400;
    throw error;
  }

  const validatedItems = [];

  for (const item of items) {
    const quantity = Number(item.quantity);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      const error = new Error("Invalid item quantity.");
      error.statusCode = 400;
      throw error;
    }

    if (!item.productId) {
      const error = new Error("A valid product ID is required.");
      error.statusCode = 400;
      throw error;
    }

    const product = await Product.findById(item.productId);

    if (!product || !product.active) {
      const error = new Error("A product in your cart is unavailable.");
      error.statusCode = 400;
      throw error;
    }

    // SERVER-SIDE SOLD OUT PROTECTION
    if (product.soldOut) {
      const error = new Error(
        `${product.name} is currently unavailable and cannot be purchased.`,
      );
      error.statusCode = 409;
      throw error;
    }

    const variant = product.variants.find(
      (variant) =>
        variant.sku === item.sku &&
        variant.color === item.color &&
        variant.size === item.size,
    );

    if (!variant) {
      const error = new Error(
        `The selected variant for ${product.name} is unavailable.`,
      );
      error.statusCode = 400;
      throw error;
    }

    const regularPrice = Number(variant.price ?? product.price ?? 0);
    const variantSalePrice = Number(variant.salePrice ?? 0);

    const unitPrice =
      variantSalePrice > 0 && variantSalePrice < regularPrice
        ? variantSalePrice
        : regularPrice;

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      const error = new Error(`Invalid price for ${product.name}.`);
      error.statusCode = 400;
      throw error;
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

  // Validate products, variants, prices, and Sold Out status.
  const validatedItems = await validateCheckoutItems(items);

  const subtotal = Number(
    validatedItems
      .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
      .toFixed(2),
  );

  const isInHouseCart = validatedItems.every(
    (item) => item.fulfillmentType === "InHouse",
  );

  let selectedRate;

  if (isInHouseCart) {
    // InHouse: retrieve the ORIGINAL Shippo rate and shipment.
    // Do not create another shipment here.
    selectedRate = await verifyInHouseShippingRate({
      shipping,
      shippingAddress,
    });
  } else {
    // Printful / Printify: retain the existing rate validation.
    const availableRates = await getShippingRates({
      items: validatedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        sku: item.sku,
        color: item.color,
        size: item.size,
      })),
      shippingAddress,
    });

    selectedRate = availableRates.find(
      (rate) =>
        String(rate.id) === String(shipping.id) &&
        rate.service === shipping.service &&
        rate.carrier === shipping.carrier,
    );
  }

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

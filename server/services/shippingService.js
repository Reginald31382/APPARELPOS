import Store from "../models/Store.js";
import Product from "../models/Products.js";
import { createShipment } from "./shipping/createShipment.js";
import { calculatePrintfulShipping } from "../config/printfulShippingRates.js";

const normalizeCountry = (country) => {
  const value = String(country || "US")
    .trim()
    .toLowerCase();

  if (
    ["us", "usa", "united states", "united states of america"].includes(value)
  ) {
    return "US";
  }

  return value.toUpperCase();
};

const isPrintfulProduct = (product) =>
  product.fulfillmentType === "PrintOnDemand" &&
  product.supplier?.name?.trim().toLowerCase() === "printful";

const isInHouseProduct = (product) => product.fulfillmentType === "InHouse";

export const getShippingRates = async ({ items, shippingAddress }) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No items provided.");
  }

  if (!shippingAddress) {
    throw new Error("Shipping address is required.");
  }

  const toAddress = {
    name: shippingAddress.name || "Customer",
    street1: shippingAddress.address1,
    street2: shippingAddress.address2 || undefined,
    city: shippingAddress.city,
    state: shippingAddress.state,
    zip: shippingAddress.zipCode || shippingAddress.zip,
    country: normalizeCountry(shippingAddress.country),
    phone: shippingAddress.phone || undefined,
    email: shippingAddress.email || undefined,
  };

  if (
    !toAddress.street1 ||
    !toAddress.city ||
    !toAddress.state ||
    !toAddress.zip
  ) {
    throw new Error("A complete shipping address is required.");
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

    const printful = isPrintfulProduct(product);
    const inHouse = isInHouseProduct(product);

    if (!printful && !inHouse) {
      throw new Error(`Shipping is not configured for "${product.name}".`);
    }

    validatedItems.push({
      product,
      quantity,
      printful,
      inHouse,
    });
  }

  const printfulItems = validatedItems.filter((item) => item.printful);

  const inHouseItems = validatedItems.filter((item) => item.inHouse);

  const hasPrintful = printfulItems.length > 0;
  const hasInHouse = inHouseItems.length > 0;

  // PRINTFUL ONLY: Use the configured Printful rate table.
  if (hasPrintful && !hasInHouse) {
    if (toAddress.country !== "US") {
      throw new Error(
        "International Printful shipping rates are not configured yet.",
      );
    }

    const cost = calculatePrintfulShipping(
      printfulItems.map(({ product, quantity }) => ({
        category: product.category,
        gender: product.gender,
        quantity,
      })),
    );

    return [
      {
        id: "printful-standard",
        shipmentId: null,
        carrier: "Printful",
        service: "Standard Shipping",
        cost,
        estimatedDays: null,
      },
    ];
  }

  // IN-HOUSE ONLY OR MIXED CART: Use Shippo.
  const store = await Store.findOne().lean();

  if (!store?.shipping) {
    throw new Error("Store shipping settings have not been configured.");
  }

  const settings = store.shipping;

  const fromAddress = {
    name: settings.businessName || settings.company || store.businessName,
    company: settings.company || undefined,
    street1: settings.street1,
    street2: settings.street2 || undefined,
    city: settings.city,
    state: settings.state,
    zip: settings.zip,
    country: normalizeCountry(settings.country),
    phone: settings.phone || undefined,
    email: settings.email || undefined,
  };

  const parcel = {
    length: String(settings.packageLength),
    width: String(settings.packageWidth),
    height: String(settings.packageHeight),
    distanceUnit: "in",
    weight: String(settings.packageWeight),
    massUnit: "oz",
  };

  const shipment = await createShipment({
    fromAddress,
    toAddress,
    parcel,
  });

  if (!shipment.rates?.length) {
    throw new Error(
      "Shippo returned no shipping rates. Check your addresses, parcel settings, and Shippo account.",
    );
  }

  const rates = shipment.rates
    .filter((rate) => {
      const cost = Number(rate.amount);

      return (
        rate.objectId &&
        Number.isFinite(cost) &&
        cost >= 0 &&
        rate.servicelevel?.name
      );
    })
    .map((rate) => ({
      id: rate.objectId,
      shipmentId: shipment.objectId,
      carrier: rate.provider,
      service: rate.servicelevel.name,
      cost: Number(rate.amount),
      estimatedDays: rate.estimatedDays ?? null,
    }));

  // MIXED CART: Only offer USPS Ground Advantage.
  if (hasPrintful && hasInHouse) {
    const groundAdvantageRates = rates.filter(
      (rate) =>
        /usps/i.test(rate.carrier || "") &&
        /ground advantage/i.test(rate.service || ""),
    );

    if (groundAdvantageRates.length === 0) {
      throw new Error(
        "USPS Ground Advantage is unavailable for this address. Please try again later or contact the store.",
      );
    }

    return groundAdvantageRates;
  }

  // IN-HOUSE ONLY: Return all valid Shippo rates.
  return rates;
};

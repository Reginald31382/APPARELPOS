import Store from "../models/Store.js";
import Product from "../models/Products.js";
import { createShipment } from "./shipping/createShipment.js";
import { calculatePrintfulShipping } from "../config/printfulShippingRates.js";
import { calculatePrintifyShipping } from "./printifyService.js";

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

const isPrintifyProduct = (product) =>
  product.fulfillmentType === "PrintOnDemand" &&
  product.supplier?.name?.trim().toLowerCase() === "printify";

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
    const printify = isPrintifyProduct(product);
    const inHouse = isInHouseProduct(product);

    if (!printful && !printify && !inHouse) {
      throw new Error(`Shipping is not configured for "${product.name}".`);
    }

    validatedItems.push({
      product,
      quantity,
      sku: item.sku,
      color: item.color,
      size: item.size,
      printful,
      printify,
      inHouse,
    });
  }

  const printfulItems = validatedItems.filter((item) => item.printful);
  const printifyItems = validatedItems.filter((item) => item.printify);
  const inHouseItems = validatedItems.filter((item) => item.inHouse);

  const hasPrintful = printfulItems.length > 0;
  const hasPrintify = printifyItems.length > 0;
  const hasInHouse = inHouseItems.length > 0;

  // Until combined shipping is implemented, do not undercharge mixed carts.
  const supplierTypesPresent = [hasPrintful, hasPrintify, hasInHouse].filter(
    Boolean,
  ).length;

  if (supplierTypesPresent > 1) {
    throw new Error(
      "Your cart contains products with different fulfillment methods. Please check out with one fulfillment type at a time.",
    );
  }

  // PRINTFUL ONLY: Preserve the existing configured Printful rates.
  if (hasPrintful) {
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

  // PRINTIFY ONLY: Request rates from Printify without creating an order.
  if (hasPrintify) {
    const lineItems = printifyItems.map(
      ({ product, quantity, sku, color, size }) => {
        const variant = product.variants.find(
          (candidate) =>
            candidate.sku === sku &&
            candidate.color === color &&
            candidate.size === size,
        );

        console.log("PRINTIFY SHIPPING DEBUG:", {
          productId: String(product._id),
          supplierProductId: product.supplier?.productId,
          requestedVariant: {
            sku,
            color,
            size,
          },
          availableVariants: product.variants.map((variant) => ({
            sku: variant.sku,
            color: variant.color,
            size: variant.size,
            supplierVariantId: variant.supplierVariantId,
          })),
          matchedVariant: variant
            ? {
                sku: variant.sku,
                color: variant.color,
                size: variant.size,
                supplierVariantId: variant.supplierVariantId,
              }
            : null,
        });

        const supplierProductId = product.supplier?.productId;
        const supplierVariantId = Number(variant?.supplierVariantId);

        if (
          !supplierProductId ||
          !variant?.supplierVariantId ||
          !Number.isSafeInteger(supplierVariantId) ||
          supplierVariantId <= 0
        ) {
          throw new Error(
            `Printify product or variant information is missing for "${product.name}".`,
          );
        }

        return {
          product_id: supplierProductId,
          variant_id: supplierVariantId,
          quantity,
        };
      },
    );

    const addressParts = String(shippingAddress.name || "Customer")
      .trim()
      .split(/\s+/);

    const firstName =
      shippingAddress.firstName || addressParts.shift() || "Customer";
    const lastName =
      shippingAddress.lastName || addressParts.join(" ") || firstName;

    const printifyRates = await calculatePrintifyShipping({
      lineItems,
      addressTo: {
        first_name: firstName,
        last_name: lastName,
        email: shippingAddress.email || "",
        phone: shippingAddress.phone || "",
        country: toAddress.country,
        region: toAddress.state,
        address1: toAddress.street1,
        address2: toAddress.street2 || "",
        city: toAddress.city,
        zip: toAddress.zip,
      },
    });

    const shippingMethods = [
      {
        key: "standard",
        id: "printify-standard",
        service: "Standard Shipping",
      },
      {
        key: "express",
        id: "printify-express",
        service: "Express Shipping",
      },
      {
        key: "priority",
        id: "printify-priority",
        service: "Priority Shipping",
      },
      {
        key: "printify_express",
        id: "printify-printify-express",
        service: "Printify Express",
      },
      {
        key: "economy",
        id: "printify-economy",
        service: "Economy Shipping",
      },
    ];

    const rates = shippingMethods
      .filter(({ key }) => printifyRates?.[key] != null)
      .map(({ key, id, service }) => ({
        id,
        shipmentId: null,
        carrier: "Printify",
        service,
        cost: Number(printifyRates[key]) / 100,
        estimatedDays: null,
      }))
      .filter((rate) => Number.isFinite(rate.cost) && rate.cost >= 0);

    if (rates.length === 0) {
      throw new Error(
        "Printify returned no shipping methods for this address and product.",
      );
    }

    return rates;
  }

  // IN-HOUSE ONLY: Preserve existing Shippo rates.
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

  return shipment.rates
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
};

import Store from "../models/Store.js";
import Product from "../models/Products.js";
import { createShipment } from "./shipping/createShipment.js";

export const getShippingRates = async ({ items, shippingAddress }) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No items provided.");
  }

  if (!shippingAddress) {
    throw new Error("Shipping address is required.");
  }

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
    country: settings.country || "US",
    phone: settings.phone || undefined,
    email: settings.email || undefined,
  };

  const toAddress = {
    name: shippingAddress.name || "Customer",
    street1: shippingAddress.address1,
    street2: shippingAddress.address2 || undefined,
    city: shippingAddress.city,
    state: shippingAddress.state,
    zip: shippingAddress.zipCode || shippingAddress.zip,
    country: shippingAddress.country || "US",
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

  // Verify that each submitted product exists and is active.
  for (const item of items) {
    const quantity = Number(item.quantity);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      throw new Error("Invalid item quantity.");
    }

    const product = await Product.findById(item.productId);

    if (!product || !product.active) {
      throw new Error("A product in your cart is unavailable.");
    }
  }

  // Use the parcel settings configured for your existing Shippo workflow.
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

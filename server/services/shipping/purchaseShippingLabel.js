import Order from "../../models/Order.js";
import Store from "../../models/Store.js";

import { createShipment } from "./createShipment.js";
import { purchaseLabel } from "./purchaseLabel.js";
import { addTimelineEvent } from "../orders/timelineService.js";
import { sendShipmentEmail } from "../email/sendShipmentEmail.js";
import { emitOrderUpdated } from "../socketService.js";

export async function purchaseShippingLabel(orderId) {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.shipping?.trackingNumber) {
    throw new Error("Shipping label already purchased.");
  }

  const store = await Store.findOne();

  if (!store) {
    throw new Error("Store settings have not been configured.");
  }

  const shippingSettings = store.shipping;

  if (!shippingSettings) {
    throw new Error("Shipping settings have not been configured.");
  }

  // console.log("ORDER");
  // console.dir(order, { depth: null });

  // console.log("STORE");
  // console.dir(store, { depth: null });

  // console.log("SHIPPING SETTINGS");
  // console.dir(shippingSettings, { depth: null });

  /*
  |--------------------------------------------------------------------------
  | Ship From
  |--------------------------------------------------------------------------
  */

  const fromAddress = {
    name:
      shippingSettings.businessName ||
      shippingSettings.company ||
      store.businessName,

    company: shippingSettings.company,

    street1: shippingSettings.street1,

    street2: shippingSettings.street2,

    city: shippingSettings.city,

    state: shippingSettings.state,

    zip: shippingSettings.zip,

    country: shippingSettings.country,

    phone: shippingSettings.phone,

    email: shippingSettings.email,
  };

  /*
  |--------------------------------------------------------------------------
  | Ship To
  |--------------------------------------------------------------------------
  */

  const toAddress = {
    name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,

    street1: order.shippingAddress.address1,

    street2: order.shippingAddress.address2,

    city: order.shippingAddress.city,

    state: order.shippingAddress.state,

    zip: order.shippingAddress.zipCode,

    country: order.shippingAddress.country,

    phone: order.shippingAddress.phone,

    email: order.shippingAddress.email,
  };

  /*
  |--------------------------------------------------------------------------
  | Parcel
  |--------------------------------------------------------------------------
  */

  const parcel = {
    length: shippingSettings.packageLength.toString(),

    width: shippingSettings.packageWidth.toString(),

    height: shippingSettings.packageHeight.toString(),

    distanceUnit: "in",

    weight: shippingSettings.packageWeight.toString(),

    massUnit: "oz",
  };

  // console.log("FROM ADDRESS");
  // console.dir(fromAddress, { depth: null });

  // console.log("TO ADDRESS");
  // console.dir(toAddress, { depth: null });

  // console.log("PARCEL");
  // console.dir(parcel, { depth: null });

  /*
  |--------------------------------------------------------------------------
  | Create Shipment
  |--------------------------------------------------------------------------
  */

  const shipment = await createShipment({
    fromAddress,
    toAddress,
    parcel,
  });

  // console.log("SHIPMENT");
  // console.dir(shipment, { depth: null });

  if (!shipment.rates?.length) {
    throw new Error("No shipping rates returned.");
  }

  /*
  |--------------------------------------------------------------------------
  | Select Rate
  |--------------------------------------------------------------------------
  */

  const rate =
    shipment.rates.find(
      (r) =>
        r.provider === shippingSettings.defaultCarrier &&
        r.servicelevel?.name === shippingSettings.defaultService,
    ) || shipment.rates[0];

  // console.log("RATE");
  // console.dir(rate, { depth: null });

  /*
  |--------------------------------------------------------------------------
  | Purchase Label
  |--------------------------------------------------------------------------
  */

  const transaction = await purchaseLabel(rate.objectId);

  // console.log("TRANSACTION");
  // console.dir(transaction, { depth: null });

  if (transaction.status !== "SUCCESS") {
    throw new Error("Unable to purchase shipping label.");
  }

  /*
  |--------------------------------------------------------------------------
  | Save Order
  |--------------------------------------------------------------------------
  */

  order.shipping.carrier = shippingSettings.defaultCarrier;

  order.shipping.service = rate.servicelevel?.name;

  order.shipping.cost = Number(rate.amount);

  order.shipping.trackingNumber = transaction.trackingNumber;

  order.shipping.labelUrl = transaction.labelUrl;

  order.shipping.status = "Label Created";

  addTimelineEvent(order, "USPS Accepted", "Shipping label created.");

  order.shipping.shippoShipmentId = shipment.objectId;

  order.shipping.shippoTransactionId = transaction.objectId;

  order.shipping.trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${transaction.trackingNumber}`;

  order.shipping.shippedAt = new Date();

  order.status = "Shipped";

  await order.save();

  emitOrderUpdated(order);

  try {
    await sendShipmentEmail(order);
  } catch (err) {
    console.error("Shipment email failed:", err);
  }

  return order;
}

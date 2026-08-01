import Order from "../../models/Order.js";
import { sendShipmentEmail } from "../email/sendShipmentEmail.js";
import { createShipment } from "./createShipment.js";
import { purchaseLabel } from "./purchaseLabel.js";
import { emitOrderUpdated } from "../socketService.js";

export async function purchaseShippingLabel(orderId) {
  // console.log("Order ID:", orderId);

  const order = await Order.findById(orderId);

  // console.log("Order:", order);

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.shipping.trackingNumber) {
    throw new Error("Shipping label already purchased.");
  }

  /*
   |---------------------------------------------------------
   | Ship From
   |---------------------------------------------------------
   | We'll replace these with Store Settings later.
   */

  const fromAddress = {
    name: "J.rome LLC",
    company: "J.rome LLC",
    street1: "1444 E Roosevelt Ln.",
    city: "Milan",
    state: "MI",
    zip: "48160",
    country: "US",
    phone: "3134741286",
    email: "shipping@jrome-studios.com",
  };

  /*
   |---------------------------------------------------------
   | Ship To
   |---------------------------------------------------------
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
   |---------------------------------------------------------
   | Parcel
   |---------------------------------------------------------
   | Temporary dimensions.
   */

  const parcel = {
    length: "12",
    width: "10",
    height: "2",
    distanceUnit: "in",
    weight: "16",
    massUnit: "oz",
  };

  /*
   |---------------------------------------------------------
   | Create Shipment
   |---------------------------------------------------------
   */

  const shipment = await createShipment({
    fromAddress,
    toAddress,
    parcel,
  });

  if (!shipment.rates?.length) {
    throw new Error("No shipping rates returned.");
  }

  /*
   |---------------------------------------------------------
   | Find USPS Ground Advantage
   |---------------------------------------------------------
   */

  const rate =
    shipment.rates.find(
      (r) =>
        r.provider === "USPS" && r.servicelevel?.name === "Ground Advantage",
    ) || shipment.rates[0];

  /*
   |---------------------------------------------------------
   | Purchase Label
   |---------------------------------------------------------
   */

  const transaction = await purchaseLabel(rate.objectId);

  if (transaction.status !== "SUCCESS") {
    throw new Error("Unable to purchase shipping label.");
  }

  /*
   |---------------------------------------------------------
   | Save Order
   |---------------------------------------------------------
   */

  order.shipping.carrier = "USPS";

  order.shipping.service = rate.servicelevel?.name;

  order.shipping.cost = Number(rate.amount);

  order.shipping.trackingNumber = transaction.trackingNumber;

  order.shipping.labelUrl = transaction.labelUrl;

  order.shipping.status = "Label Created";

  order.status = "Shipped";

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
    console.error("Shipment email failed:", err.message);
  }

  return order;
}

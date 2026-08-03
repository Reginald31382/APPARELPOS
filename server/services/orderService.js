import mongoose from "mongoose";

import Order from "../models/Order.js";

import generateOrderNumber from "../utils/generateOrderNumber.js";

import { reduceInventory } from "./inventoryService.js";
import { createNotification } from "./notificationService.js";
import { emitOrderCreated } from "./socketService.js";
import { sendReceiptEmail } from "./email/sendReceiptEmail.js";
import { addTimelineEvent } from "./orders/timelineService.js";
import { sendOrderSMS } from "./sms/sendOrderSMS.js";

/*
|--------------------------------------------------------------------------
| Complete Order
|--------------------------------------------------------------------------
*/

export async function completeOrder({
  customerEmail,
  items,
  subtotal,
  tax = 0,
  shipping = {},
  shippingAddress = {},
  total,
  paymentMethod,
  paymentStatus,
  status,
  stripeCheckoutSessionId = "",
  stripePaymentIntentId = "",
}) {
  const session = await mongoose.startSession();
  if (stripeCheckoutSessionId) {
    const existingOrder = await Order.findOne({
      stripeCheckoutSessionId,
    });

    if (existingOrder) {
      return existingOrder;
    }
  }

  try {
    session.startTransaction();

    const orderNumber = await generateOrderNumber();

    const [order] = await Order.create(
      [
        {
          orderNumber,

          customerEmail: customerEmail || shippingAddress?.email || "",

          items: items.map((item) => ({
            ...item,
            weight: item.weight || 0,
          })),

          subtotal,

          tax,

          shipping: {
            carrier: shipping.carrier || "USPS",

            service: shipping.service || "Ground Advantage",

            cost: shipping.cost || 0,

            trackingNumber: shipping.trackingNumber || "",

            labelUrl: shipping.labelUrl || "",

            status: shipping.status || "Pending",

            estimatedDelivery: shipping.estimatedDelivery || null,

            shippedAt: shipping.shippedAt || null,

            deliveredAt: shipping.deliveredAt || null,
          },

          shippingAddress,

          total,

          paymentMethod,

          paymentStatus,

          status,

          stripeCheckoutSessionId,

          stripePaymentIntentId,
        },
      ],
      { session },
    );

    addTimelineEvent(
      order,
      "Order Created",
      "Payment received and order created.",
    );

    await order.save({ session });

    await reduceInventory(order.items);

    await session.commitTransaction();
    session.endSession();

    await createNotification({
      type: "NEW_ORDER",
      title: "New Order",
      message: `${order.orderNumber} has been placed by ${order.customerEmail}`,
      orderId: order._id,
    });

    emitOrderCreated(order);

    await sendReceiptEmail(order);

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| Stripe Checkout
|--------------------------------------------------------------------------
*/

export async function createStripeOrder(session) {
  const { subtotal, tax, total, shipping, shippingAddress, items } =
    session.metadata;

  if (!shipping || !shippingAddress || !items) {
    throw new Error(
      "Checkout session metadata is incomplete. Expected shipping, shippingAddress, and items.",
    );
  }

  console.log("About to create order with:");

  console.log({
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent.id,
  });

  return completeOrder({
    customerEmail: JSON.parse(shippingAddress).email,
    items: JSON.parse(items),
    subtotal: Number(subtotal),
    tax: Number(tax),
    shipping: JSON.parse(shipping),
    shippingAddress: JSON.parse(shippingAddress),
    total: Number(total),

    paymentMethod: "Stripe",
    paymentStatus: "Paid",
    status: "Processing",

    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent.id,
  });
}

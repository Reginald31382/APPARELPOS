import mongoose from "mongoose";

import Order from "../models/Order.js";
import PendingCheckout from "../models/PendingCheckout.js";

import generateOrderNumber from "../utils/generateOrderNumber.js";

import { reduceInventory } from "./inventoryService.js";
import { createNotification } from "./notificationService.js";
import { sendNewOrderNotification } from "./email/sendNewOrderNotification.js";
import { emitOrderCreated } from "./socketService.js";
import { sendReceiptEmail } from "./email/sendReceiptEmail.js";
import { addTimelineEvent } from "./orders/timelineService.js";
import { createReceipt } from "./receiptService.js";

/*
|--------------------------------------------------------------------------
| Complete Order
|--------------------------------------------------------------------------
*/

export async function completeOrder({
  customerEmail,
  orderType = "Online",
  items,
  subtotal,
  tax = 0,
  shipping = {},
  shippingAddress = {},
  total,
  paymentMethod,
  paymentStatus,
  status,
  stripeCheckoutSessionId,
  stripePaymentIntentId,
}) {
  // Idempotency: do not create the same Stripe order twice.
  if (stripeCheckoutSessionId) {
    const existingOrder = await Order.findOne({
      stripeCheckoutSessionId,
    });

    if (existingOrder) {
      return existingOrder;
    }
  }

  const dbSession = await mongoose.startSession();
  let order;

  try {
    dbSession.startTransaction();

    const orderNumber = await generateOrderNumber();

    [order] = await Order.create(
      [
        {
          orderNumber,
          customerEmail: customerEmail || shippingAddress?.email || "",
          orderType,

          items: items.map((item) => ({
            ...item,
            weight: item.weight || 0,

            supplier: {
              name: item.supplier || "",
              productId: item.supplierProductId || "",
              variantId: item.supplierVariantId || "",
              orderId: "",
              status:
                item.fulfillmentType === "PrintOnDemand" &&
                ["Printful", "Printify"].includes(item.supplier)
                  ? "Pending"
                  : "Not Required",
              lastError: "",
            },
          })),

          subtotal,
          tax,

          shipping: {
            carrier: shipping.carrier || "USPS",
            service: shipping.service || "Ground Advantage",
            rateId: shipping.id || shipping.rateId || "",
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

          ...(stripeCheckoutSessionId && {
            stripeCheckoutSessionId,
          }),

          ...(stripePaymentIntentId && {
            stripePaymentIntentId,
          }),
        },
      ],
      { session: dbSession },
    );

    addTimelineEvent(
      order,
      "Order Created",
      "Payment received and order created.",
    );

    await order.save({ session: dbSession });

    await createReceipt(order, dbSession);

    await reduceInventory(order.items, dbSession);

    await dbSession.commitTransaction();
  } catch (error) {
    if (dbSession.inTransaction()) {
      await dbSession.abortTransaction();
    }

    throw error;
  } finally {
    await dbSession.endSession();
  }

  // Notifications happen after the database transaction commits.
  try {
    await createNotification({
      type: "NEW_ORDER",
      title: "New Order",
      message: `${order.orderNumber} has been placed by ${order.customerEmail}`,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Order notification failed:", error);
  }

  try {
    emitOrderCreated(order);
  } catch (error) {
    console.error("Order socket notification failed:", error);
  }

  // SMS remains disabled.
  try {
    // await sendOrderSMS(order);
  } catch (error) {
    console.error("Order SMS failed:", error);
  }

  try {
    await sendReceiptEmail(order);
  } catch (error) {
    console.error("Customer receipt failed:", error);
  }

  try {
    await sendNewOrderNotification(order);
  } catch (error) {
    console.error("Admin notification failed:", error);
  }

  return order;
}

/*
|--------------------------------------------------------------------------
| Create Order From Paid Stripe Checkout
|--------------------------------------------------------------------------
*/

export async function createStripeOrder(stripeSession) {
  if (stripeSession.payment_status !== "paid") {
    throw new Error(`Stripe session ${stripeSession.id} is not paid.`);
  }

  // Handle webhook retries before attempting to create another order.
  const existingOrder = await Order.findOne({
    stripeCheckoutSessionId: stripeSession.id,
  });

  if (existingOrder) {
    // Repair the pending checkout status if a previous attempt
    // created the order but failed before updating this record.
    const pendingCheckoutId = stripeSession.metadata?.pendingCheckoutId;

    if (pendingCheckoutId) {
      await PendingCheckout.findByIdAndUpdate(pendingCheckoutId, {
        status: "Completed",
      });
    }

    return existingOrder;
  }

  const pendingCheckoutId = stripeSession.metadata?.pendingCheckoutId;

  if (!pendingCheckoutId) {
    throw new Error("Stripe Checkout metadata is missing pendingCheckoutId.");
  }

  const pendingCheckout = await PendingCheckout.findById(pendingCheckoutId);

  if (!pendingCheckout) {
    throw new Error(`Pending checkout ${pendingCheckoutId} was not found.`);
  }

  // If the session ID was saved, ensure it matches this webhook.
  // It can temporarily be empty if the webhook arrives very quickly.
  if (
    pendingCheckout.stripeCheckoutSessionId &&
    pendingCheckout.stripeCheckoutSessionId !== stripeSession.id
  ) {
    throw new Error("Stripe session does not match the pending checkout.");
  }

  if (pendingCheckout.status === "Completed") {
    throw new Error(
      `Pending checkout ${pendingCheckoutId} is already completed, but its order was not found.`,
    );
  }

  const paymentIntentId =
    typeof stripeSession.payment_intent === "string"
      ? stripeSession.payment_intent
      : stripeSession.payment_intent?.id;

  const order = await completeOrder({
    customerEmail:
      pendingCheckout.shippingAddress?.email ||
      stripeSession.customer_details?.email ||
      "",

    items: pendingCheckout.items,
    subtotal: pendingCheckout.subtotal,
    tax: pendingCheckout.tax,
    shipping: pendingCheckout.shipping,
    shippingAddress: pendingCheckout.shippingAddress,
    total: pendingCheckout.total,

    paymentMethod: "Stripe",
    paymentStatus: "Paid",
    status: "Processing",

    stripeCheckoutSessionId: stripeSession.id,
    stripePaymentIntentId: paymentIntentId,
  });

  // Only mark completed after the order has been created successfully.
  await PendingCheckout.findByIdAndUpdate(pendingCheckout._id, {
    status: "Completed",
  });

  return order;
}

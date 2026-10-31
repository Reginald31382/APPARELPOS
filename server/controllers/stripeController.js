import { createStripeOrder } from "../services/orderService.js";
import { getStripe } from "../services/stripeService.js";
import { submitPrintfulOrder } from "../services/printfulOrderService.js";
import { submitPrintifyOrder } from "../services/printifyOrderService.js";

export const webhook = async (req, res) => {
  const stripe = getStripe();
  const signature = req.headers["stripe-signature"];

  let event;

  // Verify the webhook signature using Stripe's raw request body.
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error.message,
    );

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Only process completed checkout sessions.
  if (event.type !== "checkout.session.completed") {
    return res.status(200).json({ received: true });
  }

  try {
    const stripeSession = event.data.object;

    // Create or retrieve the order.
    // This function should be idempotent.
    const order = await createStripeOrder(stripeSession);

    const fulfillmentErrors = [];

    // Supplier fulfillment safety switch.
    const supplierFulfillmentEnabled =
      process.env.ENABLE_SUPPLIER_FULFILLMENT === "true";

    if (supplierFulfillmentEnabled && !order.fulfillmentReview?.required) {
      // Printful fulfillment
      try {
        await submitPrintfulOrder(order._id);
      } catch (error) {
        fulfillmentErrors.push({
          supplier: "Printful",
          message: error.message,
        });

        console.error("Printful fulfillment failed:", {
          orderId: String(order._id),
          error: error.message,
        });
      }

      // Printify fulfillment
      try {
        await submitPrintifyOrder(order._id);
      } catch (error) {
        fulfillmentErrors.push({
          supplier: "Printify",
          message: error.message,
        });

        console.error("Printify fulfillment failed:", {
          orderId: String(order._id),
          error: error.message,
        });
      }
    } else {
      console.log(
        order.fulfillmentReview?.required
          ? `Supplier fulfillment held for order ${order.orderNumber}: administrative review required.`
          : "Supplier fulfillment skipped: ENABLE_SUPPLIER_FULFILLMENT is not true.",
      );
    }

    // The paid order is saved, so acknowledge the event rather than
    // repeatedly retrying fulfillment automatically via Stripe.
    return res.status(200).json({
      received: true,
      orderId: String(order._id),
      fulfillmentErrors,
    });
  } catch (error) {
    console.error("Stripe checkout order processing failed:", error);

    return res.status(500).json({
      received: false,
      message: "Order processing failed.",
    });
  }
};

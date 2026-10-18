import { createStripeOrder } from "../services/orderService.js";
import { getStripe } from "../services/stripeService.js";

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

  // Acknowledge events this handler does not process.
  if (event.type !== "checkout.session.completed") {
    return res.status(200).json({ received: true });
  }

  try {
    const stripeSession = event.data.object;

    // console.log("Webhook event type:", event.type);
    // console.log("Webhook session ID:", stripeSession.id);
    // console.log("Webhook payment status:", stripeSession.payment_status);
    // console.log("Webhook session metadata:", stripeSession.metadata);

    await createStripeOrder(stripeSession);

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe checkout order processing failed:", error);

    // A non-2xx response tells Stripe to retry the webhook.
    return res.status(500).json({
      received: false,
      message: "Order processing failed.",
    });
  }
};

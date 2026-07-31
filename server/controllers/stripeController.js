import { createStripeOrder } from "../services/orderService.js";
import { getStripe } from "../services/stripeService.js";
import Order from "../models/Order.js";
export const webhook = async (req, res) => {
  // console.log("🔥 Webhook route hit");
  const stripe = getStripe();
  const signature = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    // console.log("✅ Webhook verified:", event.type);
    if (event.type !== "checkout.session.completed") {
      return res.status(200).json({
        received: true,
      });
    }

    const session = event.data.object;

    const existingOrder = await Order.findOne({
      stripeCheckoutSessionId: session.id,
    });

    if (existingOrder) {
      return res.json({ received: true });
    }

    // console.log("Raw metadata:", session.metadata.items);

    // console.log("Parsed metadata:", JSON.parse(session.metadata.items));

    const order = await createStripeOrder(session);

    // console.log(`Order Created: ${order.orderNumber}`);

    return res.json({ received: true });
  } catch (error) {
    // console.error("Stripe webhook error:");
    console.error(error.message);

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

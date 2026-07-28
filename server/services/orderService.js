import Order from "../models/Order.js";
import Counter from "../models/Counter.js";

async function generateOrderNumber() {
  let counter = await Counter.findOne({ name: "order" });

  if (!counter) {
    counter = await Counter.create({
      name: "order",
      sequence: 100000,
    });
  }

  counter.sequence += 1;
  await counter.save();

  return `JR-${counter.sequence}`;
}

export async function createStripeOrder(session) {
  const { subtotal, total, shipping, shippingAddress, items } =
    session.metadata;

  const parsedShipping = JSON.parse(shipping);
  const parsedShippingAddress = JSON.parse(shippingAddress);
  const parsedItems = JSON.parse(items);

  const orderNumber = await generateOrderNumber();

  const order = await Order.create({
    orderNumber,
    customerEmail: parsedShippingAddress.email,
    items: parsedItems,
    subtotal: Number(subtotal),
    shipping: parsedShipping,
    shippingAddress: parsedShippingAddress,
    total: Number(total),
    paymentMethod: "Stripe",
    paymentStatus: "Paid",
    status: "Processing",
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: session.payment_intent,
  });

  return order;
}

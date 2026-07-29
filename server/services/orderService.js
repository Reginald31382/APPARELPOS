import Order from "../models/Order.js";
import Counter from "../models/Counter.js";
import Product from "../models/Products.js";
import { createNotification } from "./notificationService.js";

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

async function deductInventory(items) {
  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    const variant = product.variants.find((v) => v.sku === item.sku);

    if (!variant) {
      throw new Error(`Variant not found: ${item.sku}`);
    }

    if (variant.quantity < item.quantity) {
      throw new Error(`Insufficient inventory for SKU ${item.sku}`);
    }

    variant.quantity -= item.quantity;

    await product.save();
  }
}

export async function createStripeOrder(session) {
  const { subtotal, total, shipping, shippingAddress, items } =
    session.metadata;

  if (!shipping || !shippingAddress || !items) {
    throw new Error(
      "Checkout session metadata is incomplete. Expected shipping, shippingAddress, and items.",
    );
  }

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

  await deductInventory(parsedItems);

  await createNotification({
    type: "NEW_ORDER",
    title: "New Order Received",
    message: `${order.orderNumber} has been placed by ${order.customerEmail}.`,
    orderId: order._id,
  });

  return order;
}

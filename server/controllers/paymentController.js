import asyncHandler from "../utils/asyncHandler.js";
import { getStripe } from "../services/stripeService.js";

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const stripe = getStripe();

  const { items, shipping, shippingAddress, subtotal, total } = req.body;

  const line_items = [
    ...items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          metadata: {
            productId: item.productId,
            sku: item.sku,
            color: item.color || "",
            size: item.size || "",
          },
        },
        unit_amount: Math.round(item.unitPrice * 100),
      },
      quantity: item.quantity,
    })),
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: shipping.service,
        },
        unit_amount: Math.round(shipping.cost * 100),
      },
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],

    line_items,

    customer_email: shippingAddress.email,

    success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/checkout`,

    metadata: {
      paymentSource: "stripe_checkout",
      subtotal: String(subtotal),
      total: String(total),
      shipping: JSON.stringify(shipping),
      shippingAddress: JSON.stringify(shippingAddress),
      items: JSON.stringify(items),
    },

    expand: ["payment_intent"],
  });

  res.json({
    id: session.id,
    url: session.url,
  });
});

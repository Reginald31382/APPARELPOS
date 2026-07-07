import Stripe from "stripe";

let stripeInstance = null;

export const getStripe = () => {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;

    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY is not defined. Check your server/.env file.",
      );
    }

    stripeInstance = new Stripe(key);
  }

  return stripeInstance;
};

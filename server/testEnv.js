import dotenv from "dotenv";

const result = dotenv.config();

console.log("Result:", result);

console.log("Stripe:", process.env.STRIPE_SECRET_KEY);

import express from "express";
import {
  createCheckoutSession,
  createPaymentIntent,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);

router.post("/create-payment-intent", createPaymentIntent);

export default router;

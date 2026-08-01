import express from "express";

import {
  calculateShippingRates,
  purchaseLabel,
  trackingWebhook,
} from "../controllers/shippingController.js";

const router = express.Router();

/*
POST /api/shipping/rates
*/
router.post("/rates", calculateShippingRates);

router.post("/purchase-label/:orderId", purchaseLabel);

router.post("/webhook", trackingWebhook);

export default router;

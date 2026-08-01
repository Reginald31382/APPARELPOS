import express from "express";

import { calculateShippingRates } from "../controllers/shippingController.js";
import { purchaseLabel } from "../controllers/shippingController.js";

const router = express.Router();

/*
POST /api/shipping/rates
*/
router.post("/rates", calculateShippingRates);

router.post("/purchase-label/:orderId", purchaseLabel);

export default router;

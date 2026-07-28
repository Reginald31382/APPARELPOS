import express from "express";

import { calculateShippingRates } from "../controllers/shippingController.js";

const router = express.Router();

/*
POST /api/shipping/rates
*/
router.post("/rates", calculateShippingRates);

export default router;

import express from "express";

import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getSuccessOrder,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getOrders);

router.get("/:id", getOrder);

router.post("/", createOrder);

router.put("/:id", updateOrder);

router.delete("/:id", deleteOrder);

router.get("/success/:sessionId", getSuccessOrder);

export default router;

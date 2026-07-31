import express from "express";

import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getSuccessOrder,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getOrders);

router.get("/success/:sessionId", getSuccessOrder);

router.get("/:id", getOrder);

router.post("/", createOrder);

router.put("/:id", updateOrder);

router.patch("/:id/status", protect, updateOrderStatus);

router.delete("/:id", deleteOrder);

export default router;

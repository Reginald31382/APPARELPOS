import express from "express";

import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getOrders);

router.get("/:id", getOrder);

router.post("/", protect, createOrder);

router.put("/:id", updateOrder);

router.delete("/:id", deleteOrder);

export default router;

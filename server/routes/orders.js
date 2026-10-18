import express from "express";

import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderByNumber,
  getSuccessOrder,
  getOrderStats,
} from "../controllers/orderController.js";

import { validatePrintfulOrder } from "../services/printfulOrderService.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getOrders);

router.get("/success/:sessionId", getSuccessOrder);

router.get("/number/:orderNumber", getOrderByNumber);

router.get("/stats", getOrderStats);

router.post(
  "/:id/printful/retry",
  protect,
  authorize("Admin", "Manager"),
  async (req, res, next) => {
    try {
      const { submitPrintfulOrder } =
        await import("../services/printfulOrderService.js");

      const order = await submitPrintfulOrder(req.params.id);

      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }

      res.status(200).json({
        success: true,
        message: "Printful order recovery check completed.",
        order,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/:id/printful/validate",
  protect,
  authorize("Admin", "Manager"),
  async (req, res, next) => {
    try {
      const result = await validatePrintfulOrder(req.params.id);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
);

router.get("/:id", getOrder);

router.post("/", createOrder);

router.put("/:id", updateOrder);

router.patch("/:id/status", protect, updateOrderStatus);

router.delete("/:id", protect, authorize("Admin"), deleteOrder);

export default router;

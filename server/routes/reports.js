import express from "express";
import {
  getReportSummary,
  getSalesReport,
  getOrdersReport,
  getProductsReport,
  getInventoryReport,
} from "../controllers/reportController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("Admin", "Manager"));

router.get("/summary", getReportSummary);

router.get("/sales", getSalesReport);

router.get("/orders", getOrdersReport);

router.get("/products", getProductsReport);

router.get("/inventory", getInventoryReport);

export default router;

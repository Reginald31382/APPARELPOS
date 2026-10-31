import express from "express";
import {
  testPrintifyConnection,
  getProducts,
  importProduct,
  getProductStatus,
  testPrintifyShipping,
  validatePrintifyOrderController,
} from "../controllers/printifyController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/test-connection",
  protect,
  authorize("Admin", "Manager"),
  testPrintifyConnection,
);

router.post(
  "/test-shipping",
  protect,
  authorize("Admin", "Manager"),
  testPrintifyShipping,
);

router.post(
  "/validate-order",
  protect,
  authorize("Admin", "Manager"),
  validatePrintifyOrderController,
);

router.get("/products", protect, authorize("Admin", "Manager"), getProducts);
router.get(
  "/products/:id/status",
  protect,
  authorize("Admin", "Manager"),
  getProductStatus,
);

router.post(
  "/products/:id/import",
  protect,
  authorize("Admin", "Manager"),
  importProduct,
);

export default router;

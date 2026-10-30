import express from "express";
import {
  testPrintifyConnection,
  getProducts,
  importProduct,
  testPrintifyShipping,
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

router.get("/products", protect, authorize("Admin", "Manager"), getProducts);

router.post(
  "/products/:id/import",
  protect,
  authorize("Admin", "Manager"),
  importProduct,
);

export default router;

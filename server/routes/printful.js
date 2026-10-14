import express from "express";
import {
  getProducts,
  importProduct,
  getProductDetails,
} from "../controllers/printfulController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/products", protect, authorize("Admin", "Manager"), getProducts);

router.get(
  "/products/:id/details",
  protect,
  authorize("Admin", "Manager"),
  getProductDetails,
);

router.post(
  "/products/:id/import",
  protect,
  authorize("Admin", "Manager"),
  importProduct,
);

export default router;

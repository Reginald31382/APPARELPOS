import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateInventory,
} from "../controllers/productController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
| Public Routes
*/
router.get("/", getProducts);
router.get("/:id", getProductById);

/*
| Protected Routes
*/
router.post("/", protect, authorize("Admin", "Manager"), createProduct);
router.put("/:id", protect, authorize("Admin", "Manager"), updateProduct);
router.delete("/:id", protect, authorize("Admin", "Manager"), deleteProduct);
router.put("/", protect, authorize("Admin", "Manager"), updateInventory);

export default router;

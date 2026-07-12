import express from "express";

import {
  getProducts,
  createProduct,
} from "../controllers/productController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
| Public Routes
*/

// Cashiers and customers can view products
router.get("/", getProducts);

/*
| Protected Routes
*/

// Only Admins and Managers can create products
router.post("/", protect, authorize("Admin", "Manager"), createProduct);

export default router;

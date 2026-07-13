import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { updateInventory } from "../controllers/productController.js";

const router = express.Router();

router.put("/", protect, authorize("Admin", "Manager"), updateInventory);

export default router;

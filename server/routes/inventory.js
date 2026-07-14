import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { updateInventory } from "../controllers/productController.js";
import { getInventoryHistory } from "../controllers/inventoryController.js";

const router = express.Router();

router.get(
  "/history",
  protect,
  authorize("Admin", "Manager"),
  getInventoryHistory,
);
router.put("/", protect, authorize("Admin", "Manager"), updateInventory);

export default router;

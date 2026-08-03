import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";

const router = express.Router();

router.get("/", protect, authorize("Admin"), getSettings);

router.put("/", protect, authorize("Admin"), updateSettings);

export default router;

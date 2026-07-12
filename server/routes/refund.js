import express from "express";

import { refundOrder } from "../controllers/refundController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/:id", protect, authorize("Admin", "Manager"), refundOrder);

export default router;

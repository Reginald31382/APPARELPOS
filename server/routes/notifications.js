import express from "express";
import {
  getNotifications,
  markAllNotificationsRead,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get latest notifications
router.get("/", protect, getNotifications);

// Mark all notifications as read
router.put("/read-all", protect, markAllNotificationsRead);

export default router;

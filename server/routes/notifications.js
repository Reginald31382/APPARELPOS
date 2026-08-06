import express from "express";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  clearReadNotifications,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get latest notifications
router.get("/", protect, getNotifications);

// Mark all notifications as read
router.put("/read-all", protect, markAllNotificationsRead);

router.put("/:id/read", protect, markNotificationRead);

router.delete("/clear-read", protect, clearReadNotifications);

export default router;

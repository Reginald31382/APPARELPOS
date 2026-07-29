import Notification from "../models/Notification.js";

export async function getNotifications(req, res, next) {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    next(error);
  }
}

export async function markAllNotificationsRead(req, res, next) {
  try {
    await Notification.updateMany({ read: false }, { $set: { read: true } });

    res.json({
      success: true,
      message: "All notifications marked as read.",
    });
  } catch (error) {
    next(error);
  }
}

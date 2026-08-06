import Notification from "../models/Notification.js";

export async function getNotifications(req, res, next) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Notification.updateMany(
      {
        read: false,
        isUrgent: false,
        createdAt: { $lt: today },
      },
      {
        $set: {
          isUrgent: true,
        },
      },
    );

    const notifications = await Notification.find()
      .sort({
        read: 1,
        createdAt: 1,
      })
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

export async function markNotificationRead(req, res, next) {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      read: true,
      readAt: new Date(),
    });

    res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
}

export async function clearReadNotifications(req, res, next) {
  try {
    await Notification.deleteMany({
      read: true,
    });

    res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
}

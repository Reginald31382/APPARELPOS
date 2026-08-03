import Notification from "../models/Notification.js";
import { getSocket } from "./socketService.js";

export async function createNotification({
  type,
  title,
  message,
  orderId = null,
  productId = null,
}) {
  const notification = await Notification.create({
    type,
    title,
    message,
    orderId,
    productId,
  });

  try {
    getSocket().emit("new-notification", notification);
  } catch (error) {
    console.warn("Socket broadcast skipped:", error.message);
  }

  return notification;
}

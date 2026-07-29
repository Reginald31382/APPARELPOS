import Notification from "../models/Notification.js";

export async function createNotification({
  type,
  title,
  message,
  orderId = null,
  productId = null,
}) {
  return Notification.create({
    type,
    title,
    message,
    orderId,
    productId,
  });
}

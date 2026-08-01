let io = null;

export function initializeSocket(socketServer) {
  io = socketServer;
}

export function getSocket() {
  if (!io) {
    throw new Error("Socket.IO has not been initialized.");
  }

  return io;
}

/* ---------------- Orders ---------------- */

export function emitOrderCreated(order) {
  getSocket().emit("order:new", order);
}

export function emitOrderUpdated(order) {
  console.log(`📡 Broadcasting update for ${order.orderNumber}`);
  getSocket().emit("order:updated", order);
}

export function emitOrderRefunded(order) {
  getSocket().emit("order:refunded", order);
}

/* ------------- Notifications ------------ */

export function emitNotificationCreated(notification) {
  getSocket().emit("notification:new", notification);
}

export function emitNotificationRead(notificationId) {
  getSocket().emit("notification:read", {
    notificationId,
  });
}

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

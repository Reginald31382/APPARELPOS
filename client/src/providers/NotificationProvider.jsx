import { useEffect } from "react";
import toast from "react-hot-toast";

import socket from "../services/socketService";

import useNotificationStore from "../store/notifications/useNotificationStore";

const NotificationProvider = ({ children }) => {
  const fetchNotifications = useNotificationStore(
    (state) => state.fetchNotifications,
  );

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  useEffect(() => {
    fetchNotifications();

    socket.connect();

    const handleNotification = async (notification) => {
      await fetchNotifications();

      toast.success(notification.title, {
        duration: 5000,
      });
    };

    socket.on("new-notification", handleNotification);

    return () => {
      socket.off("new-notification", handleNotification);

      socket.disconnect();
    };
  }, [fetchNotifications, addNotification]);

  return children;
};

export default NotificationProvider;

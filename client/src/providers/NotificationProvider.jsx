import { useEffect } from "react";
import toast from "react-hot-toast";

import api from "../api/axios";
import socket from "../services/socketService";

import useNotificationStore from "../store/notifications/useNotificationStore";

const NotificationProvider = ({ children }) => {
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const setNotifications = useNotificationStore(
    (state) => state.setNotifications,
  );

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const { data } = await api.get("/notifications");

        setNotifications(data);
      } catch (error) {
        console.error("Failed to load notifications", error);
      }
    };

    loadNotifications();

    socket.connect();

    const handleNotification = (notification) => {
      addNotification(notification);

      toast.success(notification.title, {
        duration: 5000,
      });
    };

    socket.on("new-notification", handleNotification);

    return () => {
      socket.off("new-notification", handleNotification);

      socket.disconnect();
    };
  }, [addNotification, setNotifications]);

  return children;
};

export default NotificationProvider;

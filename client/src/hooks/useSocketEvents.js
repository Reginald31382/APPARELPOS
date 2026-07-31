import { useEffect } from "react";
import toast from "react-hot-toast";
import useNotificationStore from "../store/notifications/useNotificationStore";
import { useQueryClient } from "@tanstack/react-query";
import socket from "../services/socketService";

const useSocketEvents = () => {
  const queryClient = useQueryClient();

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  useEffect(() => {
    socket.connect();

    const refreshOrders = () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    };

    const handleNotification = (notification) => {
      addNotification(notification);

      toast.success(notification.title, {
        duration: 5000,
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    };

    socket.on("order:new", refreshOrders);
    socket.on("order:updated", refreshOrders);
    socket.on("order:refunded", refreshOrders);

    socket.on("new-notification", handleNotification);

    return () => {
      socket.off("order:new", refreshOrders);
      socket.off("order:updated", refreshOrders);
      socket.off("order:refunded", refreshOrders);

      socket.off("new-notification", handleNotification);

      socket.disconnect();
    };
  }, [queryClient, addNotification]);
};

export default useSocketEvents;

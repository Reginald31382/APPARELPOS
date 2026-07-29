import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

import socket from "../services/socketService";
import useNotificationStore from "../store/notifications/useNotificationStore";

import Sidebar from "../components/layout/Sidebar";
import AdminNavbar from "../components/layout/AdminNavbar";
import Breadcrumbs from "../components/layout/Breadcrumbs";

const AdminLayout = () => {
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  useEffect(() => {
    socket.connect();

    console.log("🟢 Connected to notification server");

    const handleNotification = (notification) => {
      console.log("🔔 Notification Received:", notification);

      addNotification(notification);

      toast.success(notification.title, {
        duration: 5000,
      });
    };

    socket.on("new-notification", handleNotification);

    return () => {
      socket.off("new-notification", handleNotification);

      socket.disconnect();

      console.log("🔴 Disconnected from notification server");
    };
  }, [addNotification]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminNavbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Breadcrumbs />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

import { Outlet } from "react-router-dom";
import socket from "../services/socketService";
import { useEffect } from "react";

import Sidebar from "../components/layout/Sidebar";
import AdminNavbar from "../components/layout/AdminNavbar";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import NotificationProvider from "../providers/NotificationProvider";
import ReceiptDrawer from "../modules/receipt/ReceiptDrawer";

const AdminLayout = () => {
  useEffect(() => {
    socket.connect();

    return () => socket.disconnect();
  }, []);

  return (
    <NotificationProvider>
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

      <ReceiptDrawer />
    </NotificationProvider>
  );
};

export default AdminLayout;

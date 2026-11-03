import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";

import socket from "../services/socketService";

import Sidebar from "../components/layout/Sidebar";
import AdminNavbar from "../components/layout/AdminNavbar";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import NotificationProvider from "../providers/NotificationProvider";
import ReceiptDrawer from "../modules/receipt/ReceiptDrawer";

const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    socket.connect();

    return () => socket.disconnect();
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <NotificationProvider>
      <div className="flex h-screen min-h-0 overflow-hidden bg-gray-100">
        {/* Sidebar */}
        <Sidebar mobileOpen={mobileMenuOpen} onClose={closeMobileMenu} />

        {/* Main Application */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open admin navigation"
              aria-expanded={mobileMenuOpen}
              className="rounded-lg p-2 text-xl text-gray-700 transition hover:bg-gray-100"
            >
              <FaBars />
            </button>

            <span className="font-bold text-gray-900">J.Rome Admin</span>
          </div>

          {/* Existing Navbar */}
          <AdminNavbar />

          {/* Page Content */}
          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
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

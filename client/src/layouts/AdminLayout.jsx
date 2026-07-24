import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import AdminNavbar from "../components/layout/AdminNavbar";
import Breadcrumbs from "../components/layout/Breadcrumbs";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <AdminNavbar />

        <main className="p-8">
          <Breadcrumbs />

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

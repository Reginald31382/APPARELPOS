import { Link, NavLink } from "react-router-dom";

import { GiMoneyStack } from "react-icons/gi";
import {
  FaHome,
  FaBoxOpen,
  FaClipboardList,
  FaWarehouse,
  FaChartLine,
  FaTshirt,
} from "react-icons/fa";
import { IoSettingsSharp, IoReceiptSharp } from "react-icons/io5";
import { BsPeopleFill } from "react-icons/bs";

const SidebarLinks = ({ onNavigate }) => {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <>
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2 p-6 text-2xl font-bold"
      >
        <div className="text-2xl font-bold">J.Rome</div>
      </Link>

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        <NavLink to="/admin" end onClick={onNavigate} className={linkClasses}>
          <FaHome />
          Dashboard
        </NavLink>

        <NavLink to="/pos" onClick={onNavigate} className={linkClasses}>
          <GiMoneyStack className="text-2xl" />
          POS
        </NavLink>

        <NavLink
          to="/admin/products"
          onClick={onNavigate}
          className={linkClasses}
        >
          <FaBoxOpen />
          Products
        </NavLink>

        <NavLink
          to="/admin/printful"
          onClick={onNavigate}
          className={linkClasses}
        >
          <FaTshirt />
          Printful Products
        </NavLink>

        <NavLink
          to="/admin/printify"
          onClick={onNavigate}
          className={linkClasses}
        >
          <FaTshirt />
          Printify Products
        </NavLink>

        <NavLink
          to="/admin/orders"
          onClick={onNavigate}
          className={linkClasses}
        >
          <FaClipboardList />
          Orders
        </NavLink>

        <NavLink
          to="/admin/receipts"
          onClick={onNavigate}
          className={linkClasses}
        >
          <IoReceiptSharp />
          Receipts
        </NavLink>

        <NavLink
          to="/admin/employees"
          onClick={onNavigate}
          className={linkClasses}
        >
          <BsPeopleFill />
          Employees
        </NavLink>

        <NavLink
          to="/admin/inventory"
          onClick={onNavigate}
          className={linkClasses}
        >
          <FaWarehouse />
          Inventory
        </NavLink>

        <NavLink
          to="/admin/reports"
          onClick={onNavigate}
          className={linkClasses}
        >
          <FaChartLine />
          Reports
        </NavLink>

        <NavLink
          to="/admin/settings"
          onClick={onNavigate}
          className={linkClasses}
        >
          <IoSettingsSharp />
          Settings
        </NavLink>
      </nav>
    </>
  );
};

const Sidebar = ({ mobileOpen, onClose }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden h-full w-64 shrink-0 flex-col overflow-hidden bg-white shadow-lg md:flex">
        <SidebarLinks />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className="absolute inset-0 h-full w-full bg-black/50"
          />

          {/* Drawer */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-hidden bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 pr-4">
              <Link to="/" onClick={onClose} className="p-6 text-2xl font-bold">
                J.Rome
              </Link>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                className="rounded-lg p-2 text-2xl text-gray-600 transition hover:bg-gray-100"
              >
                &times;
              </button>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto p-4">
              <SidebarLinks onNavigate={onClose} />
            </nav>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;

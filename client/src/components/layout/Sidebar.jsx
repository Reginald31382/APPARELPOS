import { Link, NavLink } from "react-router-dom";

import { GiMoneyStack } from "react-icons/gi";
import {
  FaHome,
  FaBoxOpen,
  FaClipboardList,
  FaUsers,
  FaWarehouse,
  FaChartLine,
} from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { BsPeopleFill } from "react-icons/bs";

const Sidebar = () => {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <aside className="hidden w-64 bg-white shadow-lg md:block">
      <Link to="/" className="flex items-center gap-2 p-6 text-2xl font-bold">
        <div className="text-2xl font-bold">J.Rome</div>
      </Link>

      <nav className="space-y-2 p-4">
        <NavLink to="/admin" end className={linkClasses}>
          <FaHome />
          Dashboard
        </NavLink>

        <NavLink to="/pos" className={linkClasses}>
          <GiMoneyStack className="text-2xl" />
          POS
        </NavLink>

        <NavLink to="/admin/products" className={linkClasses}>
          <FaBoxOpen />
          Products
        </NavLink>

        <NavLink to="/admin/orders" className={linkClasses}>
          <FaClipboardList />
          Orders
        </NavLink>

        {/* <NavLink to="/admin/customers" className={linkClasses}>
          <FaUsers />
          Customers
        </NavLink> */}

        <NavLink to="/admin/employees" className={linkClasses}>
          <BsPeopleFill />
          Employees
        </NavLink>

        <NavLink to="/admin/inventory" className={linkClasses}>
          <FaWarehouse />
          Inventory
        </NavLink>

        <NavLink to="/admin/reports" className={linkClasses}>
          <FaChartLine />
          Reports
        </NavLink>

        <NavLink to="/admin/settings" className={linkClasses}>
          <IoSettingsSharp />
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;

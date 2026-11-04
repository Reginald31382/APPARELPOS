import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Package,
  ClipboardList,
  BarChart3,
  LayoutDashboard,
  Warehouse,
  Printer,
  Receipt,
  Users,
  Settings,
} from "lucide-react";

const actions = [
  {
    title: "Dashboard",
    description: "View store performance",
    icon: LayoutDashboard,
    to: "/admin",
  },
  {
    title: "New Sale",
    description: "Open the POS",
    icon: ShoppingCart,
    to: "/pos",
  },
  {
    title: "Products",
    description: "Manage your products",
    icon: Package,
    to: "/admin/products",
  },
  {
    title: "Inventory",
    description: "Manage stock levels",
    icon: Warehouse,
    to: "/admin/inventory",
  },
  {
    title: "Orders",
    description: "View and manage orders",
    icon: ClipboardList,
    to: "/admin/orders",
  },
  {
    title: "Reports",
    description: "Business analytics",
    icon: BarChart3,
    to: "/admin/reports",
  },
  {
    title: "Printful",
    description: "Manage Printful fulfillment",
    icon: Printer,
    to: "/admin/printful",
  },
  {
    title: "Printify",
    description: "Manage Printify fulfillment",
    icon: Printer,
    to: "/admin/printify",
  },
  {
    title: "Receipts",
    description: "View and manage receipts",
    icon: Receipt,
    to: "/admin/receipts",
  },
  {
    title: "Employees",
    description: "Manage employee accounts",
    icon: Users,
    to: "/admin/employees",
  },
  {
    title: "Settings",
    description: "Configure your store",
    icon: Settings,
    to: "/admin/settings",
  },
];

const QuickActions = () => {
  return (
    <div className="min-w-0 rounded-xl border bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:mb-6 sm:text-xl">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              to={action.to}
              className="group flex min-w-0 items-center gap-3 rounded-xl border p-3 transition-all hover:border-blue-500 hover:bg-blue-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:gap-4 sm:p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 transition group-hover:bg-blue-600 sm:h-12 sm:w-12">
                <Icon
                  size={22}
                  className="text-blue-600 transition group-hover:text-white"
                />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                  {action.title}
                </h3>

                <p className="text-xs text-gray-500 sm:text-sm">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;

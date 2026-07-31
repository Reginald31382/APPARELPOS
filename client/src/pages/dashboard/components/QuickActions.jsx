import { Link } from "react-router-dom";
import { ShoppingCart, Package, ClipboardList, BarChart3 } from "lucide-react";

const actions = [
  {
    title: "New Sale",
    description: "Open the POS",
    icon: ShoppingCart,
    to: "/pos",
  },
  {
    title: "Products",
    description: "Manage inventory",
    icon: Package,
    to: "/admin/products",
  },
  {
    title: "Orders",
    description: "View recent orders",
    icon: ClipboardList,
    to: "/admin/orders",
  },
  {
    title: "Reports",
    description: "Business analytics",
    icon: BarChart3,
    to: "/admin/reports",
  },
];

const QuickActions = () => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Quick Actions</h2>

      <div className="grid gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              to={action.to}
              className="group flex items-center gap-4 rounded-xl border p-4 transition-all hover:border-blue-500 hover:bg-blue-50 hover:shadow"
            >
              <div className="rounded-lg bg-blue-100 p-3 transition group-hover:bg-blue-600">
                <Icon
                  size={22}
                  className="text-blue-600 group-hover:text-white"
                />
              </div>

              <div>
                <h3 className="font-semibold">{action.title}</h3>

                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;

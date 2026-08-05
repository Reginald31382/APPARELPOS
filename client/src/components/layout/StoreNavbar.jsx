import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { GrUserWorker } from "react-icons/gr";
import { useState } from "react";

import useCustomerCartStore from "../../store/cart/useCustomerCartStore";
import useMobileCartStore from "../../store/ui/useMobileCartStore";

const links = [
  { name: "Shop", path: "/shop" },
  { name: "Men", path: "/shop?category=Men" },
  { name: "Women", path: "/shop?category=Women" },
  { name: "Kids", path: "/shop?category=Kids" },
];

const StoreNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const openCart = useMobileCartStore((state) => state.openCart);
  const items = useCustomerCartStore((state) => state.items);

  const cartCount = (items ?? []).reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      {/* Top Bar */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-12">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden"
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Logo */}
        <Link to="/">
          <img
            src="https://i.postimg.cc/9QCLhrdv/jrome-leo-szn.png"
            alt="J.Rome"
            className="h-24 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-sm uppercase tracking-[0.25em] transition ${
                  isActive
                    ? "font-semibold text-black"
                    : "text-gray-500 hover:text-black"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-5">
          <button
            onClick={openCart}
            className="relative"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="h-6 w-6" />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          <NavLink to="/admin">
            <GrUserWorker className="hidden h-6 w-6 sm:block" />
          </NavLink>
        </div>
      </div>

      {/* Mobile Horizontal Dropdown */}
      <div
        className={`overflow-hidden border-t bg-white transition-all duration-300 lg:hidden ${
          menuOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="scrollbar-hide flex gap-8 overflow-x-auto px-4 py-4">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `whitespace-nowrap text-sm uppercase tracking-[0.2em] transition ${
                  isActive
                    ? "font-semibold text-black"
                    : "text-gray-500 hover:text-black"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default StoreNavbar;

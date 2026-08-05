import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Menu, X, Mail, User, ShieldCheck } from "lucide-react";
import { RiInstagramFill } from "react-icons/ri";
import { GrUserWorker } from "react-icons/gr";
import { useState } from "react";
import useNewsletterStore from "../../store/ui/useNewsletterStore";
import useCustomerCartStore from "../../store/cart/useCustomerCartStore";
import useMobileCartStore from "../../store/ui/useMobileCartStore";

const shopLinks = [
  { name: "Shop", path: "/shop" },
  { name: "Men", path: "/shop?category=Men" },
  { name: "Women", path: "/shop?category=Women" },
  { name: "Kids", path: "/shop?category=Kids" },
];

const infoLinks = [
  {
    name: "Newsletter",
    icon: Mail,
    action: "newsletter",
  },
  {
    name: "About",
    icon: User,
    path: "/about",
  },

  {
    name: "Policies",
    icon: ShieldCheck,
    path: "/policies",
  },
  {
    name: "Instagram",
    icon: RiInstagramFill,
    path: "https://www.instagram.com/jrome_studios",
    external: true,
  },
];

const StoreNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const openCart = useMobileCartStore((state) => state.openCart);
  const openNewsletterModal = useNewsletterStore((state) => state.openModal);

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
          {shopLinks.map((link) => (
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
      {/* Mobile Dropdown */}
      <div
        className={`overflow-hidden border-t bg-white transition-all duration-300 lg:hidden ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Shop Categories */}
        <div className="scrollbar-hide flex gap-8 overflow-x-auto border-b px-4 py-4">
          {shopLinks.map((link) => (
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
        </div>

        {/* Secondary Links */}
        <div className="grid grid-cols-2 gap-3 p-4">
          {infoLinks.map((link) => {
            const Icon = link.icon;

            if (link.external) {
              return (
                <a
                  key={link.name}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-gray-100"
                >
                  <Icon size={18} />
                  {link.name}
                </a>
              );
            }

            if (link.action === "newsletter") {
              return (
                <button
                  key={link.name}
                  onClick={() => {
                    setMenuOpen(false);
                    openNewsletterModal();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-gray-100"
                >
                  <Icon size={18} />
                  {link.name}
                </button>
              );
            }

            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-gray-100"
              >
                <Icon size={18} />
                {link.name}
              </NavLink>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default StoreNavbar;

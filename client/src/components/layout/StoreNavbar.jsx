import { Link, NavLink } from "react-router-dom";
import useCartStore from "../../store/cart/useCartStore";
import useMobileCartStore from "../../store/ui/useMobileCartStore";
import { ShoppingBag } from "lucide-react";

const links = [
  { name: "Shop", path: "/shop" },
  { name: "Men", path: "/shop?category=men" },
  { name: "Women", path: "/shop?category=women" },
  { name: "Kids", path: "/shop?category=kids" },
];

const StoreNavbar = () => {
  const openCart = useMobileCartStore((state) => state.openCart);
  const items = useCartStore((state) => state.items);

  const cartCount = (items ?? []).reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl tracking-wide"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          <img
            src="https://i.postimg.cc/9QCLhrdv/jrome-leo-szn.png"
            alt="logo"
            className="h-50 w-auto"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-10 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-sm uppercase tracking-[0.25em] transition ${
                  isActive ? "text-black" : "text-gray-500 hover:text-black"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <button
            onClick={openCart}
            className="relative"
            aria-label="Open shopping cart"
          >
            <ShoppingBag className="h-6 w-6" />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default StoreNavbar;

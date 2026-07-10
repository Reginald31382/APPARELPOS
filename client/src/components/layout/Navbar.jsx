import { FaBell, FaRegUserCircle, FaSearch } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";
import { MdOutlineSettings } from "react-icons/md";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="flex h-16 items-center justify-between px-8">
        {/* Search */}
        <div className="relative w-full max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search products, orders, customers..."
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>

        {/* Right Side */}
        <div className="ml-8 flex items-center gap-6">
          <button className="relative text-gray-600 transition hover:text-black">
            <FaBell size={20} />

            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <button className="text-gray-600 transition hover:text-black">
            <MdOutlineSettings size={22} />
          </button>

          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
            >
              Admin
            </Link>

            <GiShoppingCart
              size={22}
              className="cursor-pointer transition hover:text-blue-600"
            />

            <FaRegUserCircle
              size={22}
              className="cursor-pointer transition hover:text-blue-600"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

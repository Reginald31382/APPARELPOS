import { FaBell, FaRegUserCircle, FaSearch } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";

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

          <div className="flex items-center gap-3 border-l pl-6">
            <FaRegUserCircle size={30} className="text-gray-600" />

            <div className="text-sm">
              <p className="font-semibold">Administrator</p>
              <p className="text-gray-500">J.Rome LLC</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

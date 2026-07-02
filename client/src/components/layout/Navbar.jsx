import { Link } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold tracking-wide text-gray-900">
          J.Rome POS
        </Link>

        <nav className="hidden gap-8 md:flex">
          <Link to="/">Home</Link>

          <Link to="/admin">Dashboard</Link>
        </nav>

        <div className="flex items-center gap-5">
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
    </header>
  );
};

export default Navbar;

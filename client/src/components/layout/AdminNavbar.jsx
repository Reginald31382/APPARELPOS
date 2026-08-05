// import TextCarousel from "../TextCarousel";
import NotificationDropdown from "../notifications/NotificationDropdown";
import { GiRingingBell } from "react-icons/gi";
import useNotificationStore from "../../store/notifications/useNotificationStore";
import useAuthStore from "../../modules/auth/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useState } from "react";

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const logout = useAuthStore((state) => state.logout);

  const isAdmin = useAuthStore((state) => state.isAdmin);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const handleMarkAllRead = async () => {
    try {
      await api.put("/notifications/read-all");

      markAllRead();
    } catch (error) {
      console.error("Failed to mark notifications as read.", error);
    }
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      {/* <div className="bg-black px-8 py-2">
        <TextCarousel />
      </div> */}
      <div className="flex h-16 items-center justify-between px-8">
        {/* Search */}
        {/* <div className="relative w-full max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search products, orders, customers..."
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div> */}
        {/* <h1 className="font-great-vibes text-2xl font-bold">J.Rome</h1> */}
        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isAuthenticated() ? (
            <>
              {isAdmin() && (
                <Link
                  to="/admin"
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
                >
                  Admin
                </Link>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowNotifications((prev) => !prev)}
                  className="relative rounded-full p-2 transition hover:bg-gray-100"
                  aria-label="Notifications"
                >
                  <GiRingingBell size={22} />

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <NotificationDropdown
                    onClose={() => setShowNotifications(false)}
                  />
                )}
              </div>
              <div className="border-t bg-gray-50 p-3">
                <button
                  onClick={handleMarkAllRead}
                  className="w-full rounded-lg py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                >
                  Mark All Read
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-md border px-3 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

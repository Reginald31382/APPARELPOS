import NotificationDropdown from "../notifications/NotificationDropdown";
import { GiRingingBell } from "react-icons/gi";
import useNotificationStore from "../../store/notifications/useNotificationStore";
import useAuthStore from "../../modules/auth/store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  const logout = useAuthStore((state) => state.logout);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const navigate = useNavigate();

  const handleLogout = () => {
    setShowNotifications(false);
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
      <div className="flex h-16 min-w-0 items-center justify-end px-3 sm:px-6 lg:px-8">
        {/* Right Side */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {isAuthenticated() ? (
            <>
              {/* Admin Link */}
              {isAdmin() && (
                <Link
                  to="/admin"
                  className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-black sm:px-4 sm:text-sm"
                >
                  Admin
                </Link>
              )}

              {/* Notifications */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications((prev) => !prev)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100"
                  aria-label="Notifications"
                  aria-expanded={showNotifications}
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

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100 sm:px-4 sm:text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

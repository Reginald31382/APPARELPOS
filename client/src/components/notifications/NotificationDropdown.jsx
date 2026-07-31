import { GiRingingBell } from "react-icons/gi";
import { TiShoppingCart } from "react-icons/ti";
import { useEffect, useRef } from "react";
import useNotificationStore from "../../store/notifications/useNotificationStore";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const notifications = useNotificationStore((state) => state.notifications);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 z-50 w-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
    >
      <div className="border-b px-4 py-3">
        <h3 className="text-lg font-semibold">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-gray-500">
            <GiRingingBell className="mb-2" size={28} />
            <p>No notifications yet.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => {
                if (notification.orderId) {
                  navigate(`/admin/orders?order=${notification.orderId}`);
                  onClose();
                }
              }}
              className={`cursor-pointer border-b p-4 transition hover:bg-gray-50 ${
                !notification.read ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <TiShoppingCart className="mt-1 text-green-600" size={18} />

                <div className="flex-1">
                  <h4 className="font-semibold">{notification.title}</h4>

                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold">{notification.title}</h4>

                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-600">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;

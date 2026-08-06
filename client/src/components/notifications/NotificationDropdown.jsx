import { GiRingingBell } from "react-icons/gi";
import { useEffect, useRef, useState } from "react";
import useNotificationStore from "../../store/notifications/useNotificationStore";
import { useNavigate } from "react-router-dom";
import NotificationItem from "./NotificationItem";

const NotificationDropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const notifications = useNotificationStore((state) => state.notifications);

  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const markRead = useNotificationStore((state) => state.markRead);

  const markAllReadStore = useNotificationStore((state) => state.markAllRead);

  const clearReadStore = useNotificationStore((state) => state.clearRead);
  const dropdownRef = useRef(null);
  const [showRead, setShowRead] = useState(false);

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

  const unreadNotifications = [...notifications]
    .filter((notification) => !notification.read)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const readNotifications = [...notifications]
    .filter((notification) => notification.read)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 z-50 w-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-lg font-semibold">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 rounded-full bg-black px-2 py-1 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </h3>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              try {
                await markAllReadStore();
              } catch (error) {
                console.error(error);
              }
            }}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            Read All
          </button>

          <button
            onClick={async () => {
              try {
                await clearReadStore();
              } catch (error) {
                console.error(error);
              }
            }}
            className="text-xs font-medium text-red-600 hover:underline"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {unreadNotifications.length === 0 && readNotifications.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-gray-500">
            <GiRingingBell className="mb-2" size={28} />
            <p>No notifications yet.</p>
          </div>
        ) : (
          <>
            {unreadNotifications.map((notification, index) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                index={index}
                navigate={navigate}
                onClose={onClose}
                markRead={markRead}
              />
            ))}

            {readNotifications.length > 0 && (
              <>
                <button
                  onClick={() => setShowRead(!showRead)}
                  className="w-full border-t bg-gray-50 p-3 text-sm font-medium hover:bg-gray-100"
                >
                  {showRead
                    ? "Hide Read Notifications"
                    : `Show Read Notifications (${readNotifications.length})`}
                </button>

                {showRead &&
                  readNotifications.map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                      navigate={navigate}
                      onClose={onClose}
                      markRead={markRead}
                    />
                  ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;

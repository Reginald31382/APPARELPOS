import { TiShoppingCart } from "react-icons/ti";
import { formatDistanceToNow } from "date-fns";

const NotificationItem = ({
  notification,
  index,
  navigate,
  onClose,
  markRead,
}) => {
  const handleClick = async () => {
    try {
      if (!notification.read) {
        await markRead(notification._id);
      }

      if (notification.orderId) {
        navigate(`/admin/orders?order=${notification.orderId}`);
      }

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer border-b p-4 transition hover:bg-gray-50 ${
        notification.isUrgent
          ? "bg-red-50"
          : !notification.read
            ? "bg-blue-50"
            : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <TiShoppingCart className="mt-1 text-green-600" size={18} />

        <div className="flex-1">
          <h4 className="flex items-center gap-2 font-semibold">
            {!notification.read && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                {index + 1}
              </span>
            )}

            {notification.isUrgent && (
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                Urgent
              </span>
            )}

            {notification.title}
          </h4>

          <div className="mt-1 flex justify-between">
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;

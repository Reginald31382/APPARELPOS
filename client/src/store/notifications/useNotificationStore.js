import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearReadNotifications,
} from "../../services/notificationService";
import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    const notifications = await getNotifications();

    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    });
  },

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  markAllRead: async () => {
    await markAllNotificationsRead();

    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
        readAt: new Date(),
      })),
      unreadCount: 0,
    }));
  },

  markRead: async (id) => {
    await markNotificationRead(id);

    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification._id === id
          ? {
              ...notification,
              read: true,
              readAt: new Date(),
            }
          : notification,
      ),
      unreadCount: state.notifications.filter(
        (notification) => !notification.read && notification._id !== id,
      ).length,
    }));
  },

  clearRead: async () => {
    await clearReadNotifications();

    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => !notification.read,
      ),
      unreadCount: state.notifications.filter(
        (notification) => !notification.read,
      ).length,
    }));
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification._id !== id,
      ),
    })),
}));

export default useNotificationStore;

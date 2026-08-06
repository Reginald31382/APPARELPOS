import api from "../api/axios";

export const getNotifications = async () => {
  const { data } = await api.get("/notifications");
  return data;
};

export const markNotificationRead = async (id) => {
  const { data } = await api.put(`/notifications/${id}/read`);
  return data;
};

export const markAllNotificationsRead = async () => {
  const { data } = await api.put("/notifications/read-all");
  return data;
};

export const clearReadNotifications = async () => {
  const { data } = await api.delete("/notifications/clear-read");
  return data;
};

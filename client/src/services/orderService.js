import api from "../api/axios";

export const fetchOrders = async () => {
  const { data } = await api.get("/orders");

  return data;
};

export const createOrder = async (order) => {
  const { data } = await api.post("/orders", order);

  return data;
};

export const fetchOrderStats = async () => {
  const { data } = await api.get("/orders/stats");
  return data;
};

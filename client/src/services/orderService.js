import api from "../api/axios";

export const fetchOrders = async () => {
  const { data } = await api.get("/orders");

  return data;
};

export const createOrder = async (order) => {
  // console.log("Order Payload:", JSON.stringify(order, null, 2));

  const { data } = await api.post("/orders", order);

  return data;
};

export const fetchOrderStats = async () => {
  const { data } = await api.get("/orders/stats");
  return data;
};

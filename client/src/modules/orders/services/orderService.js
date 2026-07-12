import api from "../../../api/axios";

export const getOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};

export const getOrder = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

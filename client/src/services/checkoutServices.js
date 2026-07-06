import api from "../api/axios";

export const createOrder = async (orderData) => {
  const { data } = await api.post("/orders", orderData);

  return data;
};

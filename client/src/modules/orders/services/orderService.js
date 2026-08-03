import api from "../../../api/axios";

export const getOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};

export const getOrder = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

export const updateOrderStatus = async (orderId, status) => {
  const { data } = await api.patch(
    `/orders/${orderId}/status`,
    { status },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return data;
};

export const fetchOrderStats = async () => {
  const { data } = await api.get("/orders/stats");
  return data;
};

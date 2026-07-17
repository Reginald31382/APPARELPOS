import api from "../api/axios";

export const refundOrder = async (id, reason) => {
  const { data } = await api.put(`/refunds/${id}`, {
    reason,
  });

  return data;
};

import api from "../../../api/axios";

export const refundOrder = async (id) => {
  const { data } = await api.put(`/refunds/${id}`);

  return data;
};

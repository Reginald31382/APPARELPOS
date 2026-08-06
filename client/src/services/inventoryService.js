import api from "../api/axios";

export const updateInventory = async (payload) => {
  const { data } = await api.put("/inventory/update", payload);

  return data;
};

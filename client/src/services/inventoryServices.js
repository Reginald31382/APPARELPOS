import api from "../api/axios";

export const updateInventory = async (items) => {
  const { data } = await api.post("/inventory", {
    items,
  });

  return data;
};

import api from "../../../api/axios";

export const getInventoryHistory = async () => {
  const { data } = await api.get("/inventory/history");

  return data;
};

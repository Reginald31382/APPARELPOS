import api from "../../api/axios";

export const getStore = async () => {
  const { data } = await api.get("/store");
  return data;
};

export const updateStore = async (store) => {
  const { data } = await api.put("/store", store);
  return data;
};

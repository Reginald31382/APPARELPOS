import api from "../../../api/axios";

export const getShippingSettings = async () => {
  const { data } = await api.get("/settings/shipping");
  return data;
};

export const updateShippingSettings = async (settings) => {
  const { data } = await api.put("/settings/shipping", settings);
  return data;
};

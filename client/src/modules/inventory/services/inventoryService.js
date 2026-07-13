import api from "../../../api/axios";

export const getInventory = async () => {
  const { data } = await api.get("/products");

  return data;
};

export const updateInventory = async ({ sku, quantity }) => {
  const { data } = await api.put("/inventory", {
    sku,
    quantity,
  });

  return data;
};
